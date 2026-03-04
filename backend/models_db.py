from sqlalchemy import Column, Integer, String, Date
from backend.database import Base

class JobApplicationDB(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(255))
    position = Column(String(255))
    status = Column(String(100))
    applied_date = Column(Date)
    notes = Column(String(500))