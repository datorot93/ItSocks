from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from starlette.requests import Request
import uvicorn



# from app.api.api_v1.api import api_router
from api.api_v1.api import api_router
from app.core import config
from app.db.session import SessionLocal
from app.core.celery_app import celery_app


app = FastAPI(title=config.PROJECT_NAME, docs_url='/api/docs', openapi_url='/api')

origins = [
    "http://itsocks-static-files.s3-website.us-east-2.amazonaws.com",
    "http://admin-itsocks.s3-website.us-east-2.amazonaws.com",
    "https://itsocks-static-files.s3-website.us-east-2.amazonaws.com",
    "https://ec2-18-119-112-61.us-east-2.compute.amazonaws.com",
    "https://ec2-18-189-182-50.us-east-2.compute.amazonaws.com",
    "http://ec2-3-138-195-156.us-east-2.compute.amazonaws.com",
    "http://localhost",
    "http://localhost:8000"
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:5174",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range"]
)

@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


@app.get("/api/v1/task")
async def example_task():
    celery_app.send_task("app.tasks.example_task", args=["Hello World"])

    return {"message": "success"}


# Routers
app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, reload_dirs=["app", "routers"])
    # uvicorn.run("app.main:app", host="0.0.0.0", reload=True, port=8888)