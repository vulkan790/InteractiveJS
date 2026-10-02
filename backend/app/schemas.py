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
    role: str
    created_at: str

    model_config = {"from_attributes": True}

class TaskTestCreate(BaseModel):
    input: str | None = None
    expected: str = Field(min_length=1)

class TaskTestPublic(BaseModel):
    id: int
    input: str | None = None

    model_config = {"from_attributes": True}

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1, max_length=100)
    category_key: str = Field(min_length=1, max_length=100)
    difficulty: str = Field(min_length=1, max_length=20)
    input_example: str | None = None
    output_example: str | None = None
    starter_code: str | None = None
    solution: str = Field(min_length=1)
    tests: list[TaskTestCreate] = Field(default_factory=list)

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    category_key: str
    difficulty: str
    input_example: str | None
    output_example: str | None
    starter_code: str | None
    status: str
    author_id: int
    created_at: str
    tests: list[TaskTestPublic]
 
    model_config = {"from_attributes": True}