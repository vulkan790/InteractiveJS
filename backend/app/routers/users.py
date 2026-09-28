from fastapi import *
from fastapi.security import *
from sqlalchemy.ext.asyncio import *
from sqlalchemy import *
from datetime import *
from app.db_depends import get_async_db
from app.models.user import User as UserModel
from app.schemas import UserCreate, UserUpdate, UserResponse
from app.auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user
from app.core.config import SECRET_KEY, ALGORITHM
import jwt

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_async_db)):
    result = await db.scalars(select(UserModel).where(UserModel.email == user.email))
    if result.first():
        raise HTTPException(status_code=409, detail="Email already registered")
    db_user = UserModel(email=user.email, hashed_password=hash_password(user.password), name=user.name, created_at=datetime.now(timezone.utc).isoformat())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_async_db)):
    result = await db.scalars(select(UserModel).where(UserModel.email == form_data.username))
    user = result.first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    refresh_token = create_refresh_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh-token")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_async_db)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate refresh token", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    result = await db.scalars(select(UserModel).where(UserModel.email == email))
    user = result.first()
    if user is None:
        raise credentials_exception
    access_token = create_access_token(data={"sub": user.email, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(update_data: UserUpdate, current_user: UserModel = Depends(get_current_user), db: AsyncSession = Depends(get_async_db)):
    if update_data.name is not None:
        current_user.name = update_data.name
    await db.commit()
    await db.refresh(current_user)
    return current_user