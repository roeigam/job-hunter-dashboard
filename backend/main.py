from fastapi import FastAPI, HTTPException
from fastapi import FastAPI
from typing import List

from backend.database import engine, Base, SessionLocal
from backend.models_db import JobApplicationDB
from backend.models import JobApplicationCreate, JobApplicationRead


app = FastAPI(title="Job Hunter Dashboard")

# create database tables if they don't exist
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Job Hunter Dashboard API is running"}


@app.post("/applications", response_model=JobApplicationRead)
def add_application(app_data: JobApplicationCreate):

    db = SessionLocal()

    db_app = JobApplicationDB(**app_data.model_dump())

    db.add(db_app)
    db.commit()
    db.refresh(db_app)

    db.close()

    return db_app


@app.get("/applications", response_model=List[JobApplicationRead])
def list_applications():

    db = SessionLocal()

    apps = db.query(JobApplicationDB).all()

    db.close()

    return apps