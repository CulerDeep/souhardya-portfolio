from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4

import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class MemoryStore:
    """Swap this class for a database-backed store later without changing routers."""

    def __init__(self) -> None:
        self._lock = Lock()
        self.users: dict[str, dict] = {}
        self.users_by_email: dict[str, str] = {}
        self.content: dict[str, dict] = {}

    def seed_admin(self, email: str, password: str, name: str) -> None:
        if email.lower() in self.users_by_email:
            return
        self.create_user(name=name, email=email, password=password, role="admin")

    def seed_samples(self) -> None:
        if self.content:
            return
        samples = [
            {
                "kind": "blog",
                "title": "From Flask to FastAPI",
                "summary": "Notes from shipping consulting dashboards and why a thin, typed API still wins.",
                "body": "Most of my production work at PwC sat on Flask. FastAPI is the same Python muscle with clearer contracts — useful when the database is still a future plugin and the UI needs a stable shape today.",
                "cover_url": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&q=80",
                "tags": ["engineering", "python"],
            },
            {
                "kind": "lesson",
                "title": "ETL thinking for product people",
                "summary": "How market-data pipelines actually fail, and how to talk about them without drowning in jargon.",
                "body": "A file lands. You parse it. You reconcile it. You publish a number a partner will defend. That loop — not the tool list — is the lesson.",
                "cover_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
                "tags": ["data", "lessons"],
            },
            {
                "kind": "photo",
                "title": "Kolkata monsoon light",
                "summary": "Placeholder frame until studio uploads land.",
                "body": "",
                "cover_url": "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?w=1600&q=80",
                "media_url": "https://images.unsplash.com/photo-1536421469767-80559bb6f5e1?w=2400&q=80",
                "tags": ["kolkata"],
            },
            {
                "kind": "video",
                "title": "Walkthrough: forecasting dashboard",
                "summary": "Drop a YouTube or Vimeo URL in admin to replace this placeholder.",
                "body": "A short tour of how I think about React dashboards talking to a Python API.",
                "cover_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
                "media_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "tags": ["talks"],
            },
        ]
        admin = next((u for u in self.users.values() if u["role"] == "admin"), None)
        author = admin["name"] if admin else "Souhardya Chakrabarti"
        for item in samples:
            self.create_content(item, author_name=author)

    def create_user(self, name: str, email: str, password: str, role: str = "user") -> dict:
        email_key = email.strip().lower()
        with self._lock:
            if email_key in self.users_by_email:
                raise ValueError("An account with that email already exists.")
            user_id = str(uuid4())
            user = {
                "id": user_id,
                "name": name.strip(),
                "email": email_key,
                "password_hash": hash_password(password),
                "role": role,
            }
            self.users[user_id] = user
            self.users_by_email[email_key] = user_id
            return user

    def authenticate(self, email: str, password: str) -> dict | None:
        user_id = self.users_by_email.get(email.strip().lower())
        if not user_id:
            return None
        user = self.users[user_id]
        if not verify_password(password, user["password_hash"]):
            return None
        return user

    def get_user(self, user_id: str) -> dict | None:
        return self.users.get(user_id)

    def list_content(self, kind: str | None = None, include_drafts: bool = False) -> list[dict]:
        items = list(self.content.values())
        if kind:
            items = [i for i in items if i["kind"] == kind]
        if not include_drafts:
            items = [i for i in items if i.get("published", True)]
        items.sort(key=lambda i: i["created_at"], reverse=True)
        return items

    def get_content(self, content_id: str) -> dict | None:
        return self.content.get(content_id)

    def create_content(self, payload: dict, author_name: str) -> dict:
        now = utcnow()
        item = {
            "id": str(uuid4()),
            "kind": payload["kind"],
            "title": payload["title"],
            "summary": payload.get("summary") or "",
            "body": payload.get("body") or "",
            "cover_url": payload.get("cover_url") or "",
            "media_url": payload.get("media_url") or "",
            "tags": payload.get("tags") or [],
            "published": payload.get("published", True),
            "created_at": now,
            "updated_at": now,
            "author_name": author_name,
        }
        with self._lock:
            self.content[item["id"]] = item
        return item

    def update_content(self, content_id: str, payload: dict) -> dict | None:
        item = self.content.get(content_id)
        if not item:
            return None
        with self._lock:
            for key, value in payload.items():
                if value is not None:
                    item[key] = value
            item["updated_at"] = utcnow()
        return item

    def delete_content(self, content_id: str) -> bool:
        with self._lock:
            return self.content.pop(content_id, None) is not None


store = MemoryStore()
