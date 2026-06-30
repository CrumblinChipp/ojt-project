from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password

from app.utils.security import (
    verify_password,
    create_access_token,
)

def register_user(
    db: Session,
    user: UserCreate
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered.")

    new_user = User(
        email=user.email,
        name=user.name,
        organization=user.organization,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
  
def login_user(
    db: Session,
    email: str,
    password: str,
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password.")

    if not verify_password(
        password,
        user.hashed_password,
    ):
        raise ValueError("Invalid email or password.")

    token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }