# gst-backend

[Grassit](https://github.com/c23m/grassit) 后端 API。

## 技术栈
FastAPI + SQLAlchemy 2.0 + MySQL + asyncmy

## 开发
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload

## API 文档
启动后访问 http://127.0.0.1:8000/docs