from pydantic import BaseModel
from datetime import date


class JobApplication(BaseModel):
    company: str
    position: str
    status: str
    applied_date: date
    notes: str | None = None