from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserResponse

class ActiveBorrowingCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int
    date_borrowed: str
    due_date: str
    status: str

class ActiveBorrowingResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    recipient: str
    organization: str
    quantity: int
    borrow_date: str
    due_date: str

    status: str
    
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)
    
class deleteActiveBorrowing(BaseModel):
    id: int