from pydantic import BaseModel, ConfigDict, EmailStr 
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    organization: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserUpdate(BaseModel):
    email: EmailStr
    name: str
    organization: str
    password: str
    is_admin: bool

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    organization: str
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class StaffUpdateRequest(BaseModel):
    name: str
    email: EmailStr
    organization: str


class StaffRoleUpdateRequest(BaseModel):
    is_admin: bool