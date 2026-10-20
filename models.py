from pydantic import BaseModel, Field

class NotesCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = ""
    tag: str = "General"
    is_pinned: bool = False


class NotesUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = ""
    tag: str = "General"
    is_pinned: bool = False
