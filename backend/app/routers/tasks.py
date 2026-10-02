from datetime import *
from fastapi import *
from sqlalchemy import *
from sqlalchemy.ext.asyncio import *
from app.db_depends import get_async_db
from app.models.task import Task as TaskModel
from app.models.task_test import TaskTest as TaskTestModel
from app.models.user import User as UserModel
from app.schemas import TaskCreate, TaskResponse
from app.auth import require_role
 
router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=list[TaskResponse])
async def list_tasks(category_key: str | None = Query(None), difficulty: str | None = Query(None), db: AsyncSession = Depends(get_async_db)):
    stmt = select(TaskModel).where(TaskModel.status == "Published")
    if category_key is not None:
        stmt = stmt.where(TaskModel.category_key == category_key)
    if difficulty is not None:
        stmt = stmt.where(TaskModel.difficulty == difficulty)
    result = await db.scalars(stmt)
    return result.all()

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_async_db)):
    result = await db.scalars(select(TaskModel).where(TaskModel.id == task_id, TaskModel.status == "published"))
    task = result.first()
    if task is None:
        raise HTTPException(status_code=401, detail="Task is not found")
    return task

@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(task_data: TaskCreate, current_user: UserModel = Depends(require_role("author", "moderator")), db: AsyncSession = Depends(get_async_db)):
    db_task = TaskModel(
        title=task_data.title,
        description=task_data.description,
        category=task_data.category,
        category_key=task_data.category_key,
        difficulty=task_data.difficulty,
        input_example=task_data.input_example,
        output_example=task_data.output_example,
        starter_code=task_data.starter_code,
        solution=task_data.solution,
        author_id=current_user.id,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    for test_data in task_data.tests:
        db_task.tests.append(TaskTestModel(input=test_data.input, expected=test_data.expected))
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task