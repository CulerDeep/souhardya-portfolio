import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from .store import store

SECRET_KEY = os.getenv("JWT_SECRET", "dev-only-change-me")
ALGORITHM = "HS256"
ACCESS_HOURS = 12
oauth2 = OAuth2PasswordBearer(tokenUrl="api/auth/signin", auto_error=False)


def create_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
    }


def decode_user(token: str | None) -> dict | None:
    if not token:
        return None
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = store.get_user(data.get("sub", ""))
        return user
    except JWTError:
        return None


async def optional_user(token: str | None = Depends(oauth2)) -> dict | None:
    return decode_user(token)


async def require_user(token: str | None = Depends(oauth2)) -> dict:
    user = decode_user(token)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sign in required.")
    return user


async def require_admin(user: dict = Depends(require_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin only.")
    return user
