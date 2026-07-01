from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.database.database import Base


class ActiveBorrowing(Base):
    __tablename__ = "active_borrowings"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    recipient= Column(String(255), nullable=False)
    
    organization = Column(String(255), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    
    borrow_date = Column(DateTime, nullable=False)
    
    due_date = Column(DateTime, nullable=False)
    
    status = Column(String(255), nullable=False)