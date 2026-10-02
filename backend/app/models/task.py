from sqlalchemy import *
from sqlalchemy.orm import *
from app.database import Base
from app.models.user import User

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    category_key: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)
    input_example: Mapped[str] = mapped_column(Text, nullable=True)
    output_example: Mapped[str] = mapped_column(Text, nullable=True)
    starter_code: Mapped[str] = mapped_column(Text, nullable=True)
    solution: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending", server_default="pending")
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[str] = mapped_column(String(255), nullable=True)
 
    author: Mapped["User"] = relationship(lazy="selectin")
    tests: Mapped[list["TaskTest"]] = relationship(back_populates="task", cascade="all, delete-orphan", lazy="selectin")