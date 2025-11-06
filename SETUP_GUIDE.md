# Detailed Setup Guide

## First Time Setup

### Prerequisites Check
```bash
node --version  # Should be 22+
python --version  # Should be 3.11+
docker --version  # If using Docker
```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install gunicorn
   ```

4. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

5. Run initial migrations:
   ```bash
   python manage.py migrate
   ```

6. Create admin user:
   ```bash
   python manage.py createsuperuser
   ```

7. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Database

The application uses SQLite by default for development. For production, consider using PostgreSQL.

### Testing the Integration

1. Open http://localhost:3000
2. Register a new account
3. Create a note with tags
4. Search for notes by keyword or tag

## Docker Deployment

### Building Images

```bash
docker compose build
```

### Running Containers

```bash
docker compose up -d
```

### Stopping Containers

```bash
docker-compose down
```

### Viewing Logs

```bash
docker compose logs -f [service]
```

## Troubleshooting

### Import Error: No module named 'rest_framework'
```bash
cd backend
pip install -r requirements.txt
```

### Module not found errors in frontend
```bash
cd frontend
rm -rf node_modules
pnpm install
```

### CORS errors in browser console
Verify `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py` includes your frontend URL.

### Port conflicts
- Django on 8000: `sudo lsof -i :8000`
- Next.js on 3000: `sudo lsof -i :3000`
Kill processes or change ports in configuration.

## Performance Tips

1. Use PostgreSQL for production instead of SQLite
2. Enable GZIP compression in Nginx
3. Add caching headers for static assets
4. Implement pagination for large datasets
5. Use CDN for frontend assets

## Security Checklist

- [ ] Change `SECRET_KEY` from default
- [ ] Set `DEBUG=False` in production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation on both sides
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement CSRF protection
- [ ] Add logging and monitoring
