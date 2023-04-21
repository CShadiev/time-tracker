from fastapi import FastAPI
from routers import user

app = FastAPI()

app.include_router(user.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('api:app', port=5000, reload=True,
                root_path='/')
