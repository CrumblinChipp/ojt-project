from sqlalchemy import Boolean, Column, Integer, String

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, nullable=False, index=True)

    name = Column(String(255), nullable=False)

    organization = Column(String(255), nullable=False)

    is_admin = Column(Boolean, default=False, nullable=False)

    hashed_password = Column(String(255), nullable=False)