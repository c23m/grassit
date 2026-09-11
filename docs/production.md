# 生产环境的部署

- [生产环境的部署](#生产环境的部署)
  - [整体架构](#整体架构)
  - [服务器目录规划](#服务器目录规划)
  - [配置](#配置)
  - [容器](#容器)


## 整体架构

示意:

用户浏览器: `https://grassit.cn`

- Nginx - 80/443
    - `(www.)grassit.cn/`: `/var/www/grassit/`
    - `assets.grassit.cn/...`: `/var/lib/grassit/public/...`
    - `api.grassit.cn`: `https://localhost:8080`
- Spring Boot - localhost:8080
- MySQL - localhost:3306

## 服务器目录规划

- `/var/www/grassit/`: 前端打包产物(Nginx root)
- `/opt/grassit/app.jar`: 后端应用
- `/var/lib/grassit`: 存储
  - `/public`
    - `/avatar`
    - `/attachment`
    - `/static`
- `/var/log/grassit/`: 后端日志
- `/etc/grassit/`: 配置


## 配置

将使用到的环境变量放入下方:

```
SERVER_PORT

```

改动后在TODO的日志说明

## 容器

后端环境也许用容器部署, 也许使用宿主机的环境(jdk21).

其他的(nginx, mysql)等大概不使用容器.