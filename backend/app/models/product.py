from sqlalchemy import Boolean, Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    
    is_consumable = Column(Boolean, default=False, nullable=False)
    
    sub_category = Column(String(255), nullable=False)
    
    max_stock = Column(Integer, nullable=False)
    
    current_stock = Column(Integer, nullable=False)
    
    status= Column(String(255), nullable=False)
    
    description = Column(String(255), nullable=False)
    
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    