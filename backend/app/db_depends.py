from typing import *
from fastapi import *
from sqlalchemy import *
from sqlalchemy.ext.asyncio import *
from app.database import async_session_maker

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session