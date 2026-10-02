from sqlalchemy import *
from sqlalchemy.orm import *
from app.database import Base

class TaskTest(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    input: Mapped[str] = mapped_column(Text, nullable=True)
    expected: Mapped[str] = mapped_column(Text, nullable=False)

    task: Mapped["Task"] = relationship(back_populates="tests", lazy="selectin")