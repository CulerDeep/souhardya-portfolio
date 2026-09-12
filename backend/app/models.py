from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

Role = Literal["admin", "user"]
ContentKind = Literal["blog", "lesson", "photo", "video"]


class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: Role


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class SignUpBody(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class SignInBody(BaseModel):
    email: str
    password: str


class ContentBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    summary: str = ""
    body: str = ""
    cover_url: str = ""
    media_url: str = ""
    tags: list[str] = []
    published: bool = True


class ContentCreate(ContentBase):
    kind: ContentKind


class ContentUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    body: Optional[str] = None
    cover_url: Optional[str] = None
    media_url: Optional[str] = None
    tags: Optional[list[str]] = None
    published: Optional[bool] = None


class ContentOut(ContentBase):
    id: str
    kind: ContentKind
    created_at: datetime
    updated_at: datetime
    author_name: str
