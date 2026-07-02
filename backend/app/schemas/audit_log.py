from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse

class AuditLogCreate(BaseModel):
    user_id: int
    product_id: int
    recipient: str
    organization: str
    quantity: int
    action: str
    date: str
    description: str
    
class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    recipient: str
    organization: str
    quantity: int
    action: str
    date: str
    description: str

    user: UserResponse

    class Config:
        from_attributes = True
    
class deleteAuditLog(BaseModel):
    id: int