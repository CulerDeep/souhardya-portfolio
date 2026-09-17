import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from . import store as store_module
from .routers import auth, content, profile

ROOT = Path(__file__).resolve().parents[2]
CV_PATH = ROOT / "Software Developer Resume-2.pdf"

app = FastAPI(title="Souhardya Portfolio API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://souhardya-portfolio.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store_module.store.seed_admin(
    email=os.getenv("ADMIN_EMAIL", "chakrabartisouhardya007@gmail.com"),
    password=os.getenv("ADMIN_PASSWORD", "admin123"),
    name="Souhardya Chakrabarti",
)
store_module.store.seed_samples()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

@app.get("/api/health")
def health():
    return {"ok": True, "db": "memory"}


@app.get("/api/cv")
def download_cv():
    if not CV_PATH.exists():
        return {"error": "CV not found"}
    return FileResponse(
        CV_PATH,
        media_type="application/pdf",
        filename="Souhardya-Chakrabarti-Resume.pdf",
    )
