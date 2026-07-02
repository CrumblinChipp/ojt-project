from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db

from app.schemas.user import (
    StaffUpdateRequest,
    StaffRoleUpdateRequest,
    UserResponse,
)

from app.services.user_service import (
    get_all_staff,
    update_staff,
    remove_staff,
    update_staff_role,
)

router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
)

@router.patch("/{staff_id}", response_model=UserResponse)
def edit_staff(
    staff_id: int,
    payload: StaffUpdateRequest,
    db: Session = Depends(get_db),
):
    try:
        staff = update_staff(db, staff_id, payload)

        if not staff:
            raise HTTPException(
                status_code=404,
                detail="Staff not found.",
            )

        return staff

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
        
@router.delete("/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
):
    result = remove_staff(db, staff_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Staff not found.",
        )

    return result
  
@router.patch("/{staff_id}/role", response_model=UserResponse)
def edit_staff_role(
    staff_id: int,
    payload: StaffRoleUpdateRequest,
    db: Session = Depends(get_db),
):
    staff = update_staff_role(db, staff_id, payload)

    if not staff:
        raise HTTPException(
            status_code=404,
            detail="Staff not found.",
        )

    return staff
  
@router.get("/", response_model=List[UserResponse])
def read_all_staff(
    db: Session = Depends(get_db),
):
    return get_all_staff(db)