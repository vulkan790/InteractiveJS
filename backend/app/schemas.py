from pydantic import *

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=100)

class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    created_at: str

    model_config = {"from_attributes": True}