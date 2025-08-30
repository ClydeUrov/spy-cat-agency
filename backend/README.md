# Spy Cat Agency - Backend API

FastAPI backend for the Spy Cat Agency management system.

## Features

- RESTful API for spy cats, missions, and targets
- SQLite database with SQLAlchemy ORM
- Cat breed validation using TheCatAPI
- Comprehensive error handling and validation
- Auto-generated API documentation

## Quick Start

\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
\`\`\`

## API Documentation

Once running, visit:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Database Schema

### SpyCat
- id: Primary key
- name: Cat's name
- years_of_experience: Years of spy experience
- breed: Cat breed (validated against TheCatAPI)
- salary: Annual salary

### Mission
- id: Primary key
- cat_id: Foreign key to assigned cat (nullable)
- complete: Mission completion status
- created_at: Creation timestamp

### Target
- id: Primary key
- mission_id: Foreign key to mission
- name: Target name
- country: Target country
- notes: Spy notes (editable until complete)
- complete: Target completion status

## Environment Variables

None required for development. Uses SQLite database file.

## Production Considerations

- Use PostgreSQL instead of SQLite
- Add authentication and authorization
- Configure proper CORS origins
- Add rate limiting
- Use environment variables for sensitive data
