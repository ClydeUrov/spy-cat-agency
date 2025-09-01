# 🚀 Spy Cat Agency - Setup Instructions

## Quick Start Guide

### 1. Project Structure
```
spy-cat-agency/
├── backend/          # FastAPI Python backend
└── frontend/         # Next.js React frontend
```

### 2. Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

**Backend will run at:** http://localhost:8000
- API Docs: http://localhost:8000/docs

### 3. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory  
cd frontend

# Install Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```

**Frontend will run at:** http://localhost:3000

## ✅ Verification

1. **Backend Health Check:**
   - Visit http://localhost:8000/docs
   - You should see the FastAPI documentation

2. **Frontend Connection:**
   - Visit http://localhost:3000
   - You should see "Backend connected" status indicator

## 🔧 Troubleshooting

### Backend Issues
- **Port 8000 in use:** Change port in `backend/main.py` line: `uvicorn.run(app, host="0.0.0.0", port=8001)`
- **Module not found:** Run `pip install -r requirements.txt` in backend directory

### Frontend Issues  
- **Port 3000 in use:** Next.js will automatically suggest port 3001
- **API connection failed:** Ensure backend is running on port 8000

### CORS Issues
- Backend is configured for frontend on localhost:3000
- If using different ports, update CORS settings in `backend/main.py`

## 📋 Features Ready to Test

1. **Add Spy Cat** - Click "Add Spy Cat" button
2. **View Cats** - See all cats in the table
3. **Edit Salary** - Click "Edit Salary" on any cat
4. **Delete Cat** - Click "Delete" (with confirmation)
5. **Breed Validation** - Try invalid breeds to see validation

## 🎯 Example Valid Cat Breeds
- Persian
- Siamese  
- Maine Coon
- British Shorthair
- Russian Blue
- Ragdoll

---

**Both servers must be running simultaneously for the application to work properly.**
```

```txt file="" isHidden
