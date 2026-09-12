from fastapi import APIRouter, Depends, HTTPException, status

from ..auth import create_token, public_user, require_user
from ..models import SignInBody, SignUpBody, TokenResponse, UserPublic
from ..store import store

router = APIRouter()


@router.post("/signup", response_model=TokenResponse)
def signup(body: SignUpBody):
    try:
        user = store.create_user(body.name, body.email, body.password, role="user")
    except ValueError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc
    return TokenResponse(access_token=create_token(user), user=UserPublic(**public_user(user)))


@router.post("/signin", response_model=TokenResponse)
def signin(body: SignInBody):
    user = store.authenticate(body.email, body.password)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")
    return TokenResponse(access_token=create_token(user), user=UserPublic(**public_user(user)))


@router.get("/me", response_model=UserPublic)
def me(user: dict = Depends(require_user)):
    return UserPublic(**public_user(user))
