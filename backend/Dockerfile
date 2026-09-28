FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 存储目录：PUBLIC_DIR 指向的目录必须存在，否则 FastAPI 启动时会报错
RUN mkdir -p /app/public

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]