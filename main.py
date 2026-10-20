import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import NotesCreate, NotesUpdate
from database import session, engine
import database_models
from sqlalchemy.orm import Session

load_dotenv(Path(__file__).resolve().parent / ".env")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

app= FastAPI(title="NoteMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind= engine)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "NoteMate API is running"}

# def init_db():
#     db = session()

#     count = db.query(database_models.Notes).count()

#     if count ==0:
#         for note in notes:
#             db.add(database_models.Notes(**note.model_dump()))

#         db.commit()

# init_db()

@app.get("/notes")
def get_all_notes(db: Session = Depends(get_db)):

    db_notes = db.query(database_models.Notes).all()

    return db_notes

@app.get("/notes/{id}")
def get_note_by_id(id: int, db: Session = Depends(get_db)):
    db_notes = db.query(database_models.Notes).filter(database_models.Notes.id == id).first()
    if db_notes:
        return db_notes

    return {"message": "Note not found"}



@app.post("/notes/{id}/summarize")
def summarize_note(id: int, db: Session = Depends(get_db)):
    db_note = (
        db.query(database_models.Notes)
        .filter(database_models.Notes.id == id)
        .first()
    )

    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    if not db_note.content or not db_note.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Note has no content to summarize"
        )

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=(
                "Summarize this note in simple language "
                "using 3-5 bullet points.\n\n"
                f"Title: {db_note.title}\n"
                f"Content: {db_note.content}"
            )
        )

        return {"summary": response.text}

    except Exception as e:
        print(f"Gemini summarization error: {repr(e)}")
        raise HTTPException(
            status_code=502,
            detail=str(e)
        )


# post/ create data
# adding new product
@app.post("/notes")
def add_note(note: NotesCreate, db: Session = Depends(get_db)):
    db_note = database_models.Notes(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note



# Put/ update the data
@app.put("/notes/{id}")
def update_note(id: int, note: NotesUpdate, db: Session = Depends(get_db)):
    # for i in range(len(products)):
    #    if products[i].id==id:
    #        products[i]=product
    #        return "Product added successfully"

    db_note = db.query(database_models.Notes).filter(database_models.Notes.id == id).first()

    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db_note.tag = note.tag
        db_note.is_pinned = note.is_pinned

        db.commit()
        db.refresh(db_note)
        return db_note

    return {"message": "Note not found"}


    # delete the data

@app.delete("/notes/{id}")
def delete_note(id: int, db: Session = Depends(get_db)):
    # for i in range(len(products)):
    #     if products[i].id==id:
    #         del products[i]
    #         return "Product Deleted"

    db_notes = db.query(database_models.Notes).filter(database_models.Notes.id == id).first()

    if db_notes:
        db.delete(db_notes)
        db.commit()
        return {"message": "Note deleted successfully"}
    else:
        return {"message": "Note not found"}
