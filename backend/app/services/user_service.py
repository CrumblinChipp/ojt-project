from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import (
    StaffUpdateRequest,
    StaffRoleUpdateRequest,
)


def update_staff(
    db: Session,
    staff_id: int,
    payload: StaffUpdateRequest,
):
    staff = db.query(User).filter(User.id == staff_id).first()

    if not staff:
        return None

    # Prevent duplicate emails
    existing = (
        db.query(User)
        .filter(User.email == payload.email, User.id != staff_id)
        .first()
    )

    if existing:
        raise ValueError("Email already exists.")

    staff.name = payload.name
    staff.email = payload.email
    staff.organization = payload.organization

    db.commit()
    db.refresh(staff)

    return staff


def remove_staff(
    db: Session,
    staff_id: int,
):
    staff = db.query(User).filter(User.id == staff_id).first()

    if not staff:
        return None

    db.delete(staff)
    db.commit()

    return {"message": "Staff deleted successfully."}


def update_staff_role(
    db: Session,
    staff_id: int,
    payload: StaffRoleUpdateRequest,
):
    staff = db.query(User).filter(User.id == staff_id).first()

    if not staff:
        return None

    staff.is_admin = payload.is_admin

    db.commit()
    db.refresh(staff)

    return staff

def get_all_staff(db: Session):
    staff = (
        db.query(User)
        .order_by(User.name.asc())
        .all()
    )

    return staff