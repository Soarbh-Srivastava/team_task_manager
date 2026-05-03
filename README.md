# Team Task Manager

![Build Status](https://img.shields.io/github/actions/workflow/status/Saurabh-Srivastav/team-task-manager/main.yml?branch=main)
![License](https://img.shields.io/github/license/Saurabh-Srivastav/team-task-manager)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0808?style=flat&logo=typeorm&logoColor=white)

A robust, full-stack task management solution for teams, featuring a REST API built with Express and TypeORM and a React dashboard powered by Vite.

## 🚀 Overview

The Team Task Manager provides a central place to track projects, tasks, teams, and deadlines. It uses a modular structure (separate `backend` and `frontend` folders) to make development and deployment straightforward.

### Key Features

- Full-stack architecture: separated backend and frontend codebases.
- Persistent storage via TypeORM.
- CI/CD-ready with GitHub Actions and Nixpacks configuration.
- End-to-end TypeScript for improved maintainability and safety.

## 📂 Project Structure

```text
.
├── backend/    # REST API, TypeORM entities, controllers, and tests
├── frontend/   # Vite + React application
└── nixpacks.toml
```

## Getting Started

Prerequisites

- Node.js v18 or newer
- `npm` or `pnpm`

1) Backend

```bash
cd backend
npm install
npm run build
npm run start-server
```

The backend exposes a REST API used by the frontend.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend in your browser at the address printed by Vite (usually http://localhost:5173).

## 🧪 Testing & Quality

- Backend coverage: `cd backend && npm run test:coverage`
- Frontend tests: `cd frontend && npm test`

## 🌐 Deployment

The repository includes `nixpacks.toml` for deploying with Nixpacks-compatible platforms (e.g., Railway). GitHub Actions workflows run on pushes to `main` to validate builds and tests.

## Contributor Note

Contributions are welcome. Note: some deployment-related activity in the repository may reference a secondary GitHub account used for deployment; both accounts belong to the lead developer.

## License

This project is licensed under the MIT License.
