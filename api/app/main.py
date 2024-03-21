from fastapi import FastAPI

from app.modules.encoding_handling import routes as encoding_handling_routes

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


app.include_router(encoding_handling_routes.router, prefix="/api/encoding", tags=["encoding"])
