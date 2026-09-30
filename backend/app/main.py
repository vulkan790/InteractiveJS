from fastapi import *
from fastapi.middleware.cors import *
from app.database import async_engine, Base
from app.routers.users import router as users_router

app = FastAPI(title="FastAPI InteractiveJS", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API InteractiveJS!"}