# 生产环境的部署

> **状态：未开始。**
> 当前处于开发阶段（v0.1.1），本文只是架构规划，尚未落地。
> 目前唯一的编排文件是仓库根目录的 `docker-compose.yml`（只服务于本地开发）。

- [生产环境的部署](#生产环境的部署)
  - [整体架构](#整体架构)
  - [服务器目录规划](#服务器目录规划)
  - [配置](#配置)
  - [容器](#容器)


## 整体架构

示意:

用户浏览器: `https://grassit.cn`

- Nginx - 80/443
    - `grassit.cn/`: `/var/www/grassit/`（前端打包产物）
    - `grassit.cn/api/`: 反代到 `http://127.0.0.1:8000/`（剥掉 `/api` 前缀）
    - `grassit.cn/public/`: `/var/lib/grassit/public/`（头像、附件等静态资源）
- FastAPI(uvicorn) - 127.0.0.1:8000
- MySQL - 127.0.0.1:3306

## 服务器目录规划

- `/var/www/grassit/`: 前端打包产物(Nginx root)
- `/var/lib/grassit`: 存储
  - `/public`
    - `/avatars`
    - `/attachments`
    - `/static`
- `/var/log/grassit/`: 后端日志
- `/etc/grassit/`: 配置

后端以容器或虚拟环境部署。容器内后端的工作目录是 `/app`（见 `backend/Dockerfile`），存储目录通过 `PUBLIC_DIR` 挂载进去。


## 配置

后端实际读取的环境变量（见 `backend/app/database.py`、`backend/app/main.py`）:

```
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
PUBLIC_DIR
```

前端构建时读取（见 `frontend/.env.production`）:

```
VITE_API_BASE_URL
VITE_APP_TITLE
```

改动后请更新 [CHANGELOG](../CHANGELOG.md)。

## 容器

开发阶段由根目录的 `docker-compose.yml` 编排 mysql / backend / frontend 三个服务，后端监听 8000、前端开发服务器监听 5173。

生产环境的编排方式（nginx / mysql 是否容器化、后端用容器还是宿主机 Python 环境）尚未决定。