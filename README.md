# NoteMate — AI-Powered Note Management App

NoteMate is a full-stack note management application built with FastAPI, PostgreSQL, React, and Gemini AI. It allows users to create, view, update, and delete notes, and generate AI-powered summaries of note content.

## Screenshots

### NoteMate Dashboard

![NoteMate Dashboard](screenshots/dashboard.png)

## Features

- Create, view, update, and delete notes.
- Store notes in a PostgreSQL database.
- Organize notes with tags and pin important notes.
- Generate concise summaries of notes using Gemini AI.
- Access backend APIs through FastAPI.

## Tech Stack

- **Frontend:** React, Axios
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **AI:** Google Gemini API

## Project Structure

```text
noteMate-FastAPI/
├── main.py
├── database.py
├── database_models.py
├── models.py
├── .gitignore
├── README.md
└── notemate-frontend/
    ├── package.json
    ├── package-lock.json
    ├── public/
    └── src/
```

## Prerequisites

- Python 3.10 or a compatible version
- Node.js and npm
- PostgreSQL
- A Gemini API key

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nirjharini9/Note-Mate-FastAPI.git
cd Note-Mate-FastAPI
```

### 2. Set up the Python environment

```powershell
python -m venv mynotemate
.\mynotemate\Scripts\Activate.ps1
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv google-genai
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg2://USERNAME:PASSWORD@localhost:5432/NoteMate
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholders with your own PostgreSQL credentials and Gemini API key. Ensure the PostgreSQL database `NoteMate` exists before starting the application.

**Security:** Never commit `.env` or expose API keys and database passwords publicly.

### 4. Run the backend

From the project root:

```bash
uvicorn main:app --reload
```

- Backend API: http://localhost:8000
- Interactive API documentation: http://localhost:8000/docs

### 5. Run the frontend

Open a second terminal:

```bash
cd notemate-frontend
npm install
npm start
```

The frontend is configured for `http://localhost:3000`.

If `npm start` fails in a Windows directory whose path contains `&`, try:

```powershell
node .\node_modules\react-scripts\bin\react-scripts.js start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check whether the API is running |
| GET | `/notes` | Retrieve all notes |
| GET | `/notes/{id}` | Retrieve a note by ID |
| POST | `/notes` | Create a note |
| PUT | `/notes/{id}` | Update a note |
| DELETE | `/notes/{id}` | Delete a note |
| POST | `/notes/{id}/summarize` | Generate an AI summary |

## Design Choices

- FastAPI provides API endpoints and interactive documentation.
- SQLAlchemy manages database access through ORM models and sessions.
- PostgreSQL stores notes persistently.
- Gemini generates summaries from note titles and content.
- Environment variables keep database credentials and API keys outside the source code.

## Limitations

- The current implementation uses PostgreSQL, not MongoDB.
- AI summarization requires a valid Gemini API key, network access, and available API quota.
- AI requests may fail because of rate limits or temporary service issues.
- The application currently allows requests from the local frontend origin configured in the backend.
- Authentication and user-specific note access are not currently implemented.

## Future Improvements

- Add authentication and user-specific notes.
- Improve AI error handling and summary customization.
- Add automated tests and deployment configuration.
- Add pagination and search for notes.

## Author

Developed as a full-stack learning project using FastAPI, React, PostgreSQL, and Gemini AI.
