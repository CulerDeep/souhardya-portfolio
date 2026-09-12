# Souhardya Chakrabarti — Portfolio

React (Vite) frontend and FastAPI backend. There is no database yet; content lives in memory and resets when the API restarts.

## Prerequisites

- **Node.js** 20+ (this repo was last run against Node 26)
- **Python** 3.11+ from [python.org](https://www.python.org/downloads/) — tick **Add python.exe to PATH** during setup
- Two terminals, both starting from this folder: `D:\souhardya-portfolio`

Do **not** type `python` until the real interpreter is installed. On Windows, `python` often opens a Microsoft Store stub and prints:

`Python was not found; run without arguments to install from the Microsoft Store...`

Use the launcher instead: `py -3`. If that also fails (`Unable to create process` / missing `python.exe`), install Python 3.13:

```powershell
winget install --id Python.Python.3.13 --source winget --accept-package-agreements --accept-source-agreements
```

Then **close and reopen** the terminal. Optionally turn off the Store aliases: **Settings → Apps → Advanced app settings → App execution aliases** → switch off **python.exe** and **python3.exe**.

## Run locally

Start the API first, then the frontend.

### 1. Backend (port 8000)

```powershell
cd D:\souhardya-portfolio\backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

After the venv is active, `python` is the one inside `.venv`, not the Store stub.

If PowerShell blocks the venv script, run this once, then activate again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

The API is ready when you can open http://127.0.0.1:8000/api/health and see `{"ok":true,"db":"memory"}`.

### 2. Frontend (port 5173)

In a **second** terminal:

```powershell
cd D:\souhardya-portfolio\frontend
npm install
npm run dev
```

Open **http://localhost:5173** in the browser.

Vite proxies `/api` to the FastAPI server, so keep both processes running. The CV download uses `/api/cv` and needs the backend up.

## Sign in

**Admin (studio — create blogs, lessons, photos, videos)**

- Email: `chakrabartisouhardya007@gmail.com`
- Password: `admin123`

Override with `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables before you go live.

**Everyone else:** use **Join** to create a reader account, then **Sign in**.
