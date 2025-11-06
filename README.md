# Notes Management App - Full Stack Application

A modern full-stack application for managing notes with tagging and search capabilities. Built with Next.js (frontend) and Django (backend).

## Project Structure

```
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   └── package.json
├── backend/                 # Django application
│   ├── config/             # Django configuration
│   ├── notes_api/          # Notes app
│   ├── manage.py
│   └── requirements.txt
└── docker-compose.yml       # Docker orchestration
```

## Prerequisites

- Node.js 22+ (for frontend development)
- Python 3.11+ (for backend development)
- Docker and Docker Compose (for containerized deployment)

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Set environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start development server
pnpm dev
```

Visit http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
  ```json
  {"username": "user", "password": "pass"}
  ```
- `POST /api/token/refresh/` - Refresh token
- `POST /api/users/register/` - Register new user
  ```json
  {"username": "user", "email": "user@example.com", "password": "pass", "password_confirm": "pass"}
  ```

### Notes
- `GET /api/notes/` - List user's notes
- `POST /api/notes/` - Create note
  ```json
  {"title": "My Note", "content": "Content here", "tags": ["tag1", "tag2"]}
  ```
- `GET /api/notes/{id}/` - Get specific note
- `PUT /api/notes/{id}/` - Update note
- `DELETE /api/notes/{id}/` - Delete note

## Features

- User authentication with JWT tokens
- Create, read, update, and delete notes
- Tag-based organization
- Search notes by keyword or tag
- Responsive UI built with React and Tailwind CSS
- RESTful API with Django REST Framework
- CORS enabled for frontend-backend communication
- Docker containerization for easy deployment

## Environment Variables

### Backend (`backend/.env`)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Development

### Making Changes

1. **Backend changes**: Restart the Django server for changes to take effect
2. **Frontend changes**: Next.js hot-reloads automatically

## Deployment

### To Production

1. Build Docker images:
   ```bash
   docker compose build
2. Push to registry (Docker Hub, ECR, etc.)
3. Deploy to your platform (AWS, Heroku, DigitalOcean, etc.)

### Environment Variables for Production

Update these before deploying:
- `SECRET_KEY` - Use a strong random key
- `DEBUG` - Set to `False`
- `ALLOWED_HOSTS` - Add your domain
- `CORS_ALLOWED_ORIGINS` - Add your frontend domain

## Troubleshooting

### Backend Won't Connect
- Check CORS settings in `backend/config/settings.py`
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure backend is running on port 8000

### Database Issues
- Run migrations: `python manage.py migrate`
- Clear database: `rm backend/db.sqlite3` (then migrate again)

### Port Already in Use
- Change ports in `docker-compose.yml` or kill existing processes
- Backend: `lsof -ti:8000 | xargs kill`
- Frontend: `lsof -ti:3000 | xargs kill`

## Future Enhancements

- Add user profiles and settings
- Implement note sharing and collaboration
- Add rich text editor
- Implement note backup and export

## License

MIT License - feel free to use this project as a template for your own applications.
