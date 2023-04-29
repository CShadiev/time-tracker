from fastapi import FastAPI
from routers import user, project, task
from config import config

app = FastAPI()

app.include_router(user.router)
app.include_router(project.router)
app.include_router(task.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        'api:app',
        host='0.0.0.0',
        port=config.UVICORN_PORT,
        reload=True,
        root_path=f'/{config.UVICORN_HOME}')
