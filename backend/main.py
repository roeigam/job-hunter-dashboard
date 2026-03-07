from fastapi import FastAPI, HTTPException
from fastapi import FastAPI
from typing import List

from backend.database import engine, Base, SessionLocal
from backend.models_db import JobApplicationDB
from backend.models import JobApplicationCreate, JobApplicationRead, JobApplicationUpdate


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

@app.get("/applications/{app_id}", response_model=JobApplicationRead)
def get_application(app_id: int):
    db = SessionLocal()

    app = db.query(JobApplicationDB).filter(JobApplicationDB.id == app_id).first()

    db.close()

    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return app

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):

    db = SessionLocal()

    app = db.query(JobApplicationDB).filter(JobApplicationDB.id == app_id).first()

    if app is None:
        db.close()
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()
    db.close()

    return {"message": "Application deleted"}

@app.patch("/applications/{app_id}", response_model=JobApplicationRead)
def update_application(app_id: int, app_data: JobApplicationUpdate):

    db = SessionLocal()

    app = db.query(JobApplicationDB).filter(JobApplicationDB.id == app_id).first()

    if app is None:
        db.close()
        raise HTTPException(status_code=404, detail="Application not found")

    app.company = app_data.company
    app.position = app_data.position
    app.status = app_data.status
    app.applied_date = app_data.applied_date
    app.notes = app_data.notes

    db.commit()
    db.refresh(app)
    db.close()

    return app