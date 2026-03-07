from pydantic import BaseModel
from datetime import date


class JobApplicationCreate(BaseModel):
    company: str
    position: str
    status: str
    applied_date: date
    notes: str | None = None


class JobApplicationRead(JobApplicationCreate):
    id: int

class JobApplicationUpdate(BaseModel):
    company: str
    position: str
    status: str
    applied_date: date
    notes: str | None = None