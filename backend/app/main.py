from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.router import api_router
from backend.app.core.config import parse_cors_origins

app = FastAPI(
    title="VerdeWatt Backend API",
    description="API for building load, EV sessions, and smart charging allocation.",
    version="0.1.0",
)

cors_origins = parse_cors_origins()
print("CORS_ORIGINS =", cors_origins)

# CORS setup for local + LAN frontend development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
