from fastapi import FastAPI
from models.models import Base 
from db.database import engine
from routes import authentication
from routes import authorization
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
Base.metadata.create_all(bind=engine)



origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(authentication.router, tags=["Authentication"])
app.include_router(authorization.router, tags=["Authorization"])



