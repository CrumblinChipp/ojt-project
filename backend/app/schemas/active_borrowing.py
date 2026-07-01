from pydantic import BaseModel, ConfigDict

class ActiveBorrowingCreate(BaseModel):
    user_id: int
    product_id: int
    quantity: int
    date_borrowed: str
    due_date: str
    status: str

class activeBorrowingResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    date_borrowed: str
    due_date: str
    status: str

    model_config = ConfigDict(from_attributes=True)
    
class deleteActiveBorrowing(BaseModel):
    id: int