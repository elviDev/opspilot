from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import services, checks, incidents, chat
from app.scheduler import start_scheduler
from app.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="OpsPilot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(services.router)
app.include_router(checks.router)
app.include_router(incidents.router)
app.include_router(chat.router)


@app.on_event("startup")
def on_startup():
    start_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
