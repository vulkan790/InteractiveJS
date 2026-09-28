import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
DATABASE_URL = os.getenv("DATABASE_URL")