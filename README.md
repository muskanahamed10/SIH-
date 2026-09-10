# iGOT Karmayogi — AI Competency Gap Platform (SIH 2026)

Official Statistical System AI-Enabled Learning & Competency Gap Platform.

## 📁 Repository Structure

```
├── frontend/                  # Next.js 14 Web Application
│   ├── app/                   # App Router ([locale], api/learner, etc.)
│   ├── components/            # UI components (charts, radar, learner, admin)
│   ├── lib/                   # API layer, adapters, utils
│   ├── messages/              # Multilingual translations (en, hi, te)
│   ├── types/                 # TypeScript domain contracts
│   └── package.json           # Frontend dependencies & scripts
│
└── backend/                   # FastAPI Server & Data Layer
    ├── services/api/          # Core API, endpoints, security, models, schemas
    │   ├── api/v1/endpoints/  # REST endpoints (auth, competencies, gaps, learner)
    │   ├── models/            # SQLAlchemy 12 Canonical Entities
    │   ├── engine/            # SIH 6-Factor Competency Gap Formula Engine
    │   └── adapters/          # iGOT Platform mock adapter
    ├── tests/                 # 95 Comprehensive unit & integration tests
    ├── requirements.txt       # Python dependencies
    └── setup_supabase.py      # Cloud Supabase PostgreSQL database initializer
```

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI & Supabase)

```bash
cd backend
pip install -r requirements.txt

# Run all 95 automated tests
python -m pytest tests/ -v

# Start the API server
uvicorn services.api.main:app --reload --port 8000
```
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 2. Frontend Setup (Next.js 14)

```bash
cd frontend
npm install
npm run dev
```
- **Web Application**: http://localhost:3000

---

## ☁️ Cloud Database (Supabase)

The backend connects directly to **Supabase PostgreSQL**.
To initialize tables and demo data in Supabase:
```bash
cd backend
python setup_supabase.py
```
