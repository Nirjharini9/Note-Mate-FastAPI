# NoteMate AI frontend

React 18 / Create React App frontend inspired by the provided Anchor notes dashboard.

## Run
```bash
npm install
npm start
```
Open http://localhost:3000.

## Included
- Responsive notes dashboard, tag filters and search
- Create/edit notes, pin/unpin
- Archive, restore, trash, permanent delete
- Grid/list toggle and basic multi-select
- localStorage persistence for this browser

## Backend status
This is currently a frontend demo; it saves to browser localStorage and is not yet connected to FastAPI. `package.json` has a development proxy for `http://localhost:8000`. Before integrating Axios, match the actual backend request/response schema.
