from backend.database import engine, Base
from backend.models_db import JobApplicationDB
from fastapi import FastAPI
from backend.models import JobApplication

app = FastAPI(title="Job Hunter Dashboard")

applications = []


@app.get("/")
def home():
    return {"message": "Job Hunter Dashboard API is running"}


@app.post("/applications")
def add_application(app_data: JobApplication):
    applications.append(app_data)
    return {"message": "Application added", "data": app_data}


@app.get("/applications")
def list_applications():
    return applications