from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import jwt, httpx, os
from passlib.context import CryptContext

app = FastAPI(title="Codex Divine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "codex-divine-super-secret-key-32bytes!")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

users_db = {}
projects_db = []
tasks_db = []

# ── Models ──────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Project(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    status: str = "active"
    created_at: Optional[str] = None

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    project_id: int
    status: str = "todo"
    priority: str = "medium"
    created_at: Optional[str] = None

class AIMessage(BaseModel):
    message: str

class TaskStatusUpdate(BaseModel):
    status: str

# ── Auth helpers ─────────────────────────────────────
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Routes ───────────────────────────────────────────
@app.get("/")
def home():
    return {"project": "Codex Divine", "status": "running", "message": "AI DevOps Platform API"}

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Auth
@app.post("/auth/register")
def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[user.username] = {
        "password": pwd_context.hash(user.password),
        "email": user.email
    }
    return {"message": "User created successfully"}

@app.post("/auth/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form.username)
    if not user or not pwd_context.verify(form.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token({"sub": form.username}), "token_type": "bearer"}

@app.get("/auth/me")
def me(user: str = Depends(verify_token)):
    return {"username": user, "email": users_db.get(user, {}).get("email")}

# Projects
@app.get("/projects", response_model=List[Project])
def get_projects(user=Depends(verify_token)):
    return projects_db

@app.post("/projects", response_model=Project)
def create_project(project: Project, user=Depends(verify_token)):
    project.id = len(projects_db) + 1
    project.created_at = datetime.utcnow().isoformat()
    projects_db.append(project)
    return project

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, user=Depends(verify_token)):
    global projects_db
    projects_db = [p for p in projects_db if p.id != project_id]
    return {"message": "Project deleted"}

# Tasks
@app.get("/tasks", response_model=List[Task])
def get_tasks(user=Depends(verify_token)):
    return tasks_db

@app.post("/tasks", response_model=Task)
def create_task(task: Task, user=Depends(verify_token)):
    task.id = len(tasks_db) + 1
    task.created_at = datetime.utcnow().isoformat()
    tasks_db.append(task)
    return task

@app.put("/tasks/{task_id}/status")
def update_task_status(task_id: int, body: TaskStatusUpdate, user=Depends(verify_token)):
    for task in tasks_db:
        if task.id == task_id:
            task.status = body.status
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user=Depends(verify_token)):
    global tasks_db
    tasks_db = [t for t in tasks_db if t.id != task_id]
    return {"message": "Task deleted"}

# AI Chat
@app.post("/ai/chat")
async def ai_chat(msg: AIMessage, user=Depends(verify_token)):
    if not GROQ_API_KEY:
        return {"response": "⚠️ GROQ_API_KEY not set. Add it to docker-compose.yml as environment variable."}
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": "You are an expert DevOps AI assistant. Help with Docker, CI/CD, Kubernetes, cloud deployments, and infrastructure automation. Be concise and practical."},
                    {"role": "user", "content": msg.message}
                ],
                "max_tokens": 1024
            },
            timeout=30.0
        )
        data = resp.json()
        return {"response": data["choices"][0]["message"]["content"]}
