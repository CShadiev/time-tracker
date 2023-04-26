from fastapi import FastAPI
from routers import user, project, task

app = FastAPI()

app.include_router(user.router)
app.include_router(project.router)
app.include_router(task.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('api:app', port=5000, reload=True,
                root_path='/')
