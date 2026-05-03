# Team Task Manager

Full-stack task management app with an Express + TypeORM backend and a Vite + React frontend.

## Structure

- `backend/` - REST API, database connection, controllers, and test coverage
- `frontend/` - React UI, shared components, and API integration

## Setup

### Backend

```bash
cd backend
npm install
npm run build
npm run start-server
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

- Backend: `cd backend && npm run test:coverage`
- Frontend: `cd frontend && npm test`

## Deployment

The repo includes a GitHub Actions workflow and a Nixpacks config for Railway-style deployment of the backend service.