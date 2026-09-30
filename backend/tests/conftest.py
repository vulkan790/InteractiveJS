import pytest
from pathlib import *
from sqlalchemy import *
from sqlalchemy.ext.asyncio import *
from fastapi.testclient import *
from app.main import app
from app.database import Base
from app.db_depends import get_async_db

TEST_DB_PATH = Path(__file__).parent / "test.db"
TEST_DATABASE_URL_ASYNC = f"sqlite+aiosqlite:///{TEST_DB_PATH}"
TEST_DATABASE_URL_SYNC = f"sqlite:///{TEST_DB_PATH}"

test_async_engine = create_async_engine(TEST_DATABASE_URL_ASYNC, echo=False)
TestSessionLocal = async_sessionmaker(test_async_engine, expire_on_commit=False, class_=AsyncSession)

sync_engine_for_schema = create_engine(TEST_DATABASE_URL_SYNC)

async def override_get_async_db():
    async with TestSessionLocal() as session:
        yield session 

app.dependency_overrides[get_async_db] = override_get_async_db

@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=sync_engine_for_schema)
    Base.metadata.create_all(bind=sync_engine_for_schema)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c