from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Notes(Base):

    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False, default="")
    tag = Column(String(100), nullable=False, default="General")
    is_pinned = Column(Boolean, default=False, nullable=False)