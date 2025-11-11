from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.auth import router as auth_router
from .core.config import settings


app = FastAPI(
    title="AI Chat App - Authentication API",
    description="Authentication service for the AI Chat application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "AI Chat App Authentication Service"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}