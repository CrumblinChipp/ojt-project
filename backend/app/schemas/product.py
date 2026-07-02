from pydantic import BaseModel, ConfigDict
from datetime import date

class ProductCreate(BaseModel):
  name: str
  is_consumable: bool
  sub_category: str
  max_stock: int
  current_stock: int
  status: str
  description: str
  
class ProductResponse(BaseModel):
  id: int
  name: str
  is_consumable: bool
  sub_category: str
  max_stock: int
  current_stock: int
  status: str
  description: str
  created_at: str

  model_config = ConfigDict(from_attributes=True)
  
  
class PullOutRequest(BaseModel):
  product_id: int
  recipient: str
  organization: str
  quantity: int
  
class StockInRequest(BaseModel):
  product_id: int
  quantity: int

class DeleteRequest(BaseModel):
  product_id: int
  
class DeleteProductPreview(BaseModel):
  product: ProductResponse
  audit_log_count: int
  active_borrowing_count: int

class ReturnProductRequest(BaseModel):
    active_borrowing_id: int

class ProductUpdate(BaseModel):
  product_id: int
  name: str
  is_consumable: bool
  sub_category: str
  max_stock: int
  description: str
  
class DeleteAuditLogsRequest(BaseModel):
    start_date: date
    end_date: date