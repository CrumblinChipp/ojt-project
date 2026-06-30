import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError("DATABASE_URL not found in .env")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
from sqlalchemy import text

if __name__ == "__main__":
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ Successfully connected to PostgreSQL!")
    except Exception as e:
        print("❌ Database connection failed")
        print(e)