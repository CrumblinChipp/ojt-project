from pydantic import BaseModel, ConfigDict

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

    model_config = ConfigDict(from_attributes=True)
    
class deleteAuditLog(BaseModel):
    id: int