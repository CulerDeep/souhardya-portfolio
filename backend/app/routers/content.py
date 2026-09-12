from fastapi import APIRouter, Depends, HTTPException, Query, status

from ..auth import optional_user, require_admin
from ..models import ContentCreate, ContentOut, ContentUpdate
from ..store import store

router = APIRouter()


def _can_see_drafts(user: dict | None) -> bool:
    return bool(user and user.get("role") == "admin")


@router.get("", response_model=list[ContentOut])
def list_items(kind: str | None = Query(default=None), user: dict | None = Depends(optional_user)):
    return store.list_content(kind=kind, include_drafts=_can_see_drafts(user))


@router.get("/{content_id}", response_model=ContentOut)
def get_item(content_id: str, user: dict | None = Depends(optional_user)):
    item = store.get_content(content_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    if not item.get("published", True) and not _can_see_drafts(user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    return item


@router.post("", response_model=ContentOut, status_code=201)
def create_item(body: ContentCreate, admin: dict = Depends(require_admin)):
    return store.create_content(body.model_dump(), author_name=admin["name"])


@router.patch("/{content_id}", response_model=ContentOut)
def update_item(content_id: str, body: ContentUpdate, admin: dict = Depends(require_admin)):
    item = store.update_content(content_id, body.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    return item


@router.delete("/{content_id}", status_code=204)
def delete_item(content_id: str, admin: dict = Depends(require_admin)):
    if not store.delete_content(content_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
