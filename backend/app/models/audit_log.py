from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    recipient = Column(String(255), nullable=False)
    
    organization = Column(String(255), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    
    action = Column(String(255), nullable=False)
    
    date = Column(DateTime, default=datetime.now, nullable=False)
    
    description = Column(String(255), nullable=False)
    
    