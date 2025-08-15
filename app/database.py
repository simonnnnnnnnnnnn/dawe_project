import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# this serves as the config file for sqlalchemy
DB_USER = os.getenv("DB_USER")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_HOST=os.getenv("DB_HOST", "localhost")
DB_NAME=os.getenv("DB_NAME")
DB_PORT=os.getenv("DB_PORT", "3307")

# now the full path can be set up neatly like this
DATABASE_URL = f'mysql+pysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()