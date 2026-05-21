# Mini Application Workflow Tracker

This repository contains a full-stack business application workflow tracker built with Django + Django Ninja for the backend and React (Vite) for the frontend.

# Author
 ## Name: GARETH KIMUTAI TIROP
 ## Email: tiropgarreth@gmail.com

## Features

- Draft creation, editing, and resubmission
- Submission and review workflow transitions
- Reviewer decisions with comments for `Need More Information` and `Rejected`
- PostgreSQL backend support with environment configuration
- React frontend with dynamic environment variables for local and production

## Architecture

- `backend/`: Django backend API with Django Ninja
- `frontend/`: React frontend built with Vite
- `.env.example` files in each folder for environment configuration

## Setup

### Backend

1. Install Python 3.10+ or 3.11.
2. Create and activate a virtual environment inside `backend/`:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the example environment file and update values:
   ```bash
   copy .env.example .env
   ```
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Install Node.js 18+ and npm.
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Copy the example env file and update API base URL if needed:
   ```bash
   copy .env.example .env
   ```
4. Start the frontend app:
   ```bash
   npm run dev
   ```

## Deployment Notes

- Backend reads PostgreSQL config from environment variables.
- Frontend reads API base URL from `VITE_API_BASE_URL`.
- Use `.env` files locally and production environment variables for deployments.

## Assumptions

- The workflow is business legality-focused and supports application types like `Recordation`, `Renewal`, and ownership changes.
- Reviewer decisions require explicit comments for partial or rejected outcomes.
- The app is designed for a separated frontend and backend deployment.

## Improvements with more time

- Add authentication and role-based access: To ensure applicants have permissions to edit and save drafts as well as submit || and officials have permissions to review, approve and reject: [Will need a users model] 
- Add pagination, search, and filtering
- Add automated tests for API and frontend flows
- Add production-grade deployment scripts and CI pipeline
