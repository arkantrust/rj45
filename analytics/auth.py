# from datetime import timedelta, datetime
# from typing import Annotated, Any
# from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from os import getenv

# from models import User

# router = APIRouter(
#     prefix="/auth",
#     tags=["auth"],
# )

# JWT_KEY = getenv('JWT_SECRET', )
# ALGORITHM = "HS256"


# bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


# class Token(BaseModel):
#     access_token: str
#     token_type: str

# @router.post("/", status_code=201)
# async def add_user(user: UserCreate, db: db_dependency):
#     if user_exists(db, user.username):
#         raise HTTPException(status_code=409, detail="Username already registered")

#     db_user = User(username=user.username, password=bcrypt.hash(user.password))
#     db.add(db_user)
#     db.commit()


# @router.post("/token", response_model=Token)
# async def login_for_access_token(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
# ):
#     user: User = authenticate(form_data.username, form_data.password, db)

#     if not user:
#         raise HTTPException(
#             status_code=401,
#             detail="Could not validate credentials",
#         )
#     token = gen_jwt(
#         user.username.__str__(), int(user.id.__str__()), timedelta(minutes=20)
#     )

#     return {"token_type": "bearer", "access_token": token}


# def authenticate(username: str, password: str, db: Session) -> User:
#     user = db.query(User).filter(User.username == username).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     if not bcrypt.verify(password, user.password.__str__()):
#         raise HTTPException(status_code=401, detail="Invalid password")
#     return user


# def gen_jwt(username: str, user_id: int, expires_delta: timedelta):
#     encode = {"sub": username, "id": user_id}
#     expires = datetime.utcnow() + expires_delta
#     encode.update({"exp": expires})
#     return jwt.encode(encode, JWT_KEY, algorithm=ALGORITHM)


# def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
#     try:
#         payload: dict[str, Any] = jwt.decode(token, JWT_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         user_id: int = payload.get("id")
#         if username is None or user_id is None:
#             raise HTTPException(status_code=401, detail="Invalid authentication")
#         return {"username": username, "id": user_id}
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid authentication")
