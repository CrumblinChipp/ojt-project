from pydantic import BaseModel, ConfigDict

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

class ProductUpdate(BaseModel):
  name: str
  is_consumable: bool
  sub_category: str
  max_stock: int
  current_stock: int
  status: str
  description: str
  