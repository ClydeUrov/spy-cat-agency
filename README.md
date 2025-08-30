# Spy Cat Agency Management System

A full-stack web application for managing spy cats, missions, and targets. Built with FastAPI backend and Next.js frontend.

## 🏗️ Project Structure

\`\`\`
spy-cat-agency/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── database.py         # Database models and configuration
│   ├── schemas.py          # Pydantic schemas for API validation
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js 14 app directory
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page (Spy Cats management)
│   │   ├── missions/      # Missions page (placeholder)
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   │   ├── SpyCatForm.tsx
│   │   ├── SpyCatList.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorAlert.tsx
│   ├── lib/              # Utility libraries
│   │   ├── api.ts        # API client functions
│   │   └── utils.ts      # Utility functions
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── package.json      # Node.js dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js # PostCSS configuration
│   └── next.config.js    # Next.js configuration
└── README.md             # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (for frontend package management)

### 1. Clone or Create Project Structure

Create the following directory structure and copy all the provided files:

\`\`\`bash
mkdir spy-cat-agency
cd spy-cat-agency
mkdir backend frontend
mkdir frontend/app frontend/components frontend/lib frontend/types
mkdir frontend/app/missions
\`\`\`

### 2. Backend Setup (FastAPI)

#### Install Python Dependencies

\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

#### Start the Backend Server

\`\`\`bash
python main.py
\`\`\`

Or using uvicorn directly:

\`\`\`bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

The backend will be available at: **http://localhost:8000**

- API Documentation: http://localhost:8000/docs
- Alternative API Docs: http://localhost:8000/redoc

### 3. Frontend Setup (Next.js)

#### Install Node.js Dependencies

\`\`\`bash
cd frontend
npm install
\`\`\`

#### Start the Frontend Development Server

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at: **http://localhost:3000**

## 📋 Features

### Backend (FastAPI)

- **Spy Cats Management**
  - Create, read, update, delete spy cats
  - Validate cat breeds using TheCatAPI
  - Salary management
  
- **Missions & Targets**
  - Create missions with 1-3 targets
  - Assign missions to available cats
  - Update target notes and completion status
  - Automatic mission completion when all targets are done
  
- **Business Logic**
  - One cat can only have one active mission
  - Cannot delete cats with active missions
  - Cannot delete assigned missions
  - Cannot update notes on completed targets/missions

### Frontend (Next.js)

- **Spy Cats Dashboard**
  - View all spy cats in a responsive table
  - Add new spy cats with form validation
  - Edit cat salaries inline
  - Delete cats with confirmation
  - Real-time error handling and user feedback
  
- **User Experience**
  - Loading states and spinners
  - Error alerts with detailed messages
  - Backend connection status indicator
  - Responsive design for mobile and desktop

## 🔧 API Endpoints

### Spy Cats

- `GET /cats/` - List all spy cats
- `POST /cats/` - Create a new spy cat
- `GET /cats/{cat_id}` - Get a specific spy cat
- `PUT /cats/{cat_id}` - Update spy cat salary
- `DELETE /cats/{cat_id}` - Delete a spy cat

### Missions

- `GET /missions/` - List all missions
- `POST /missions/` - Create a new mission with targets
- `GET /missions/{mission_id}` - Get a specific mission
- `PUT /missions/{mission_id}/assign` - Assign a cat to a mission
- `DELETE /missions/{mission_id}` - Delete an unassigned mission

### Targets

- `PUT /targets/{target_id}` - Update target notes or completion status

## 🗄️ Database

The application uses SQLite database (`spy_cats.db`) with the following tables:

- **spy_cats**: id, name, years_of_experience, breed, salary
- **missions**: id, cat_id, complete, created_at
- **targets**: id, mission_id, name, country, notes, complete

## 🔍 Validation

- **Cat Breeds**: Validated against TheCatAPI (https://api.thecatapi.com/v1/breeds)
- **Mission Targets**: Must have 1-3 targets per mission
- **Business Rules**: Enforced at API level with proper error messages

## 🛠️ Development

### Backend Development

\`\`\`bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload

# Run tests (if you add them)
pytest
\`\`\`

### Frontend Development

\`\`\`bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
\`\`\`

## 🚨 Troubleshooting

### Backend Issues

1. **Import Errors**
   \`\`\`bash
   pip install --upgrade pip
   pip install -r requirements.txt
   \`\`\`

2. **Database Issues**
   - Delete `spy_cats.db` file and restart the server to recreate tables

3. **Port Already in Use**
   \`\`\`bash
   uvicorn main:app --port 8001
   \`\`\`

### Frontend Issues

1. **Node Modules Issues**
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

2. **API Connection Issues**
   - Ensure backend is running on http://localhost:8000
   - Check CORS settings in backend main.py

3. **Build Issues**
   \`\`\`bash
   npm run build
   \`\`\`

### Common Issues

1. **CORS Errors**
   - Backend is configured for frontend on localhost:3000
   - If using different ports, update CORS settings in `backend/main.py`

2. **Cat Breed Validation Fails**
   - Ensure internet connection for TheCatAPI
   - Use valid breed names like: "Persian", "Siamese", "Maine Coon", "British Shorthair"

## 📝 Example Usage

### Adding a Spy Cat

1. Click "Add Spy Cat" button
2. Fill in the form:
   - Name: "Agent Whiskers"
   - Years of Experience: 5
   - Breed: "Persian" (must be valid from TheCatAPI)
   - Salary: 75000
3. Click "Create Spy Cat"

### API Example

\`\`\`bash
# Create a spy cat
curl -X POST "http://localhost:8000/cats/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agent Whiskers",
    "years_of_experience": 5,
    "breed": "Persian",
    "salary": 75000
  }'
\`\`\`

## 🔐 Security Notes

- This is a development setup - add authentication for production
- Database is SQLite - consider PostgreSQL for production
- Add input sanitization and rate limiting for production use

## 📄 License

This project is for educational/assessment purposes.
