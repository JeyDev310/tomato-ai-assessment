# Notes Management System - Setup Instructions

A simple Django + Next.js Notes Management System with authentication, tagging, and search capabilities.

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

## Quick Start with Docker

### 1. Clone or download the project

```bash
cd notes-management-system
```

### 2. Create environment file

```bash
cp .env.example .env
```

### 3. Build and run with Docker Compose

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Build and run Django backend (port 8000)
- Run Next.js frontend (port 3000)

### 4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin

### 5. Initialize the database

Run migrations (if not automatic):

```bash
docker-compose exec backend python manage.py migrate
```

Create a superuser for Django admin:

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Manual Setup (Without Docker)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Setup PostgreSQL database and update `.env` with your database credentials

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Start the server:
```bash
python manage.py runserver
```

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication

- **Register**: `POST /api/auth/register/`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Login**: `POST /api/auth/token/`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Notes Endpoints

All endpoints require authentication header: `Authorization: Bearer <token>`

- **List notes**: `GET /api/notes/`
- **Create note**: `POST /api/notes/`
  ```json
  {
    "title": "My Note",
    "content": "Note content here",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Get note**: `GET /api/notes/{id}/`
- **Update note**: `PUT /api/notes/{id}/`
- **Delete note**: `DELETE /api/notes/{id}/`
- **Search by keyword**: `GET /api/notes/search_by_keyword/?keyword=search_term`
- **Search by tag**: `GET /api/notes/search_by_tag/?tag=tag_name`

## Features

✅ User authentication with JWT tokens
✅ Create, read, update, delete notes
✅ Add multiple tags to notes
✅ Search notes by keyword (title or content)
✅ Search notes by tag
✅ PostgreSQL database
✅ CORS enabled for frontend-backend communication
✅ Docker containerization for easy deployment

## Environment Variables

See `.env.example` for all available configuration options:

- `DEBUG` - Django debug mode (False in production)
- `SECRET_KEY` - Django secret key (change in production)
- `DB_*` - Database configuration
- `ALLOWED_HOSTS` - Allowed host names
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend

## Production Deployment

Before deploying to production:

1. Change `SECRET_KEY` to a secure random value
2. Set `DEBUG=False`
3. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
4. Use a strong database password
5. Configure proper database backups
6. Use environment-specific `.env` files
7. Set up SSL/TLS certificates
8. Use a production WSGI server configuration

## Troubleshooting

### Database connection errors
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database credentials

### CORS errors
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Check that `NEXT_PUBLIC_API_URL` matches backend URL

### Port conflicts
- Change ports in `docker-compose.yml` if 3000, 5000, or 5432 are in use
- Update `NEXT_PUBLIC_API_URL` if backend port changes

### Notes not loading
- Ensure authentication token is valid
- Check browser console for API errors
- Verify backend is running and accessible

## Project Structure

```
notes-management-system/
├── backend/
│   ├── config/          # Django settings & urls
│   ├── notes/           # Notes app
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main page
│   ├── layout.tsx
│   └── globals.css
├── components/          # React components
│   ├── auth-form.tsx
│   ├── note-form.tsx
│   ├── notes-list.tsx
│   └── search-bar.tsx
├── docker-compose.yml
└── .env.example
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API responses for error messages
3. Check Docker logs: `docker compose logs`
4. Verify all services are running: `docker ps`
