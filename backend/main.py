from fastapi import FastAPI
from models.models import Base 
from db.database import engine
import routes.routes as routes
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



app.include_router(routes.router, tags=["Authentication"])



