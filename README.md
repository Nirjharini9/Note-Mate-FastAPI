# NoteMate — AI-Powered Note Management App

NoteMate is a full-stack note management application built with FastAPI, PostgreSQL, React, and Gemini AI. It allows users to create, view, update, and delete notes, organize them with tags, pin important notes, and generate AI-powered summaries.

## Screenshots

![NoteMate Dashboard](screenshots/dashboard.png)

## Features

- Create, view, update, and delete notes.
- Store notes in a PostgreSQL database.
- Organize notes with tags and pin important notes.
- Generate AI-powered summaries using Gemini.
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
├── screenshots/
│   └── dashboard.png
└── notemate-frontend/
    ├── package.json
    ├── package-lock.json
    ├── public/
    └── src/
```

## Prerequisites

- Python 3.10 or compatible version
- Node.js and npm
- PostgreSQL
- A Google Gemini API key

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nirjharini9/Note-Mate-FastAPI.git
cd Note-Mate-FastAPI
```

### 2. Create a Python virtual environment

```powershell
python -m venv mynotemate
.\mynotemate\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv google-genai
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg2://USERNAME:PASSWORD@localhost:5432/NoteMate
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholders with your own credentials. Make sure the PostgreSQL database `NoteMate` exists before starting the application.

**Security:** Never commit `.env` or expose API keys and database passwords publicly.

### 5. Run the backend

```bash
uvicorn main:app --reload
```

- Backend API: http://localhost:8000
- Interactive API documentation: http://localhost:8000/docs

### 6. Run the frontend

Open a second terminal:

```bash
cd notemate-frontend
npm install
npm start
```

The frontend is configured for `http://localhost:3000`.

If `npm start` fails because the Windows project path contains `&`, try:

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

- **FastAPI:** Provides API endpoints and interactive documentation.
- **SQLAlchemy:** Manages database access through ORM models and sessions.
- **PostgreSQL:** Stores notes persistently.
- **Gemini AI:** Generates summaries from note titles and content.
- **Environment variables:** Keep credentials and API keys outside source code.

## Limitations

- The current implementation uses PostgreSQL rather than MongoDB.
- AI summarization requires a valid Gemini API key, network access, and available API quota.
- AI requests may fail due to rate limits or temporary service issues.
- Authentication and user-specific note access are not implemented.
- CORS is configured for the local frontend origin.

## Future Improvements

- Add authentication and user-specific notes.
- Improve AI error handling and summary customization.
- Add automated tests and deployment configuration.
- Add pagination and note search.

## Author

Developed as a full-stack learning project using FastAPI, React, PostgreSQL, and Gemini AI.

This project is crafted by **Nirjharini..** 💡.

I’d love to hear your feedback! Feel free to share your thoughts. ❤️