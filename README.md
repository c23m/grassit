# Grassit

网站项目的企划书。

在线地址：<https://grassit.cn>

## 目录
- [Grassit](#grassit)
  - [目录](#目录)
  - [概要](#概要)
    - [技术栈](#技术栈)
    - [项目阶段](#项目阶段)
  - [存储结构](#存储结构)
    - [用户表](#用户表)
    - [文章表](#文章表)
    - [资源表](#资源表)
    - [文件存储](#文件存储)
  - [接口规范](#接口规范)
    - [通用约定](#通用约定)
    - [GET `/api/user/:id`](#get-apiuserid)
    - [GET `/api/article/{identifier}`](#get-apiarticleidentifier)
    - [GET `/api/article/:id/content`](#get-apiarticleidcontent)
    - [GET `/api/article/:id/raw`](#get-apiarticleidraw)
    - [POST `/api/article/upload`](#post-apiarticleupload)

---

## 概要

### 技术栈

- **前端**：Vue 3（JavaScript）+ Vite + Vue Router
- **后端**：Spring Boot
- **数据库**：MySQL
- **桌面端**：Electron(计划)
- **实时通信**：WebSocket / WebRTC(计划)
- **部署**：
  - Linux / WSL
  - Nginx（反向代理 + 静态资源）
  - Cloudflare Tunnel（对外暴露）
  - Docker Compose（编排所有服务）

### 项目阶段

| 版本     | 内容                                                                      | 当前状态                     |
| -------- | ------------------------------------------------------------------------- | ---------------------------- |
| **0.x**  | 前端基础页面 + 路由，后端 Docker 环境搭建，实现文章查询接口（硬编码数据） | **进行中**（后端脚手架搭建） |
| **1.0**  | 文章系统完整实现：通过 slug 查看预存文章，支持 Markdown 渲染与资源映射    | 计划中                       |
| **2.0**  | 账号系统（注册/登录），文章与用户关联，数据库完整接入，文章发布与列表     | 计划中                       |
| **3.0**  | 个人资源存储系统，文章内引用本地图片/附件，Markdown 资源自动替换          | 计划中                       |
| **4.0**  | Electron 桌面端，WebSocket 实时通信，推送与私聊                           | 远期                         |
| **待定** | Wiki、标签、自定义样式、留言、多版本、游戏模块等                          | 需求池                       |

## 存储结构

### 用户表

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    nickname VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(512)
);
```

### 文章表

> 禁止`slug`使用uuid格式(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)!  
> 前端和后端都要校验
>
> 正文内容不存储在数据库，而是以文件形式存放

```sql
CREATE TABLE articles (
    uuid CHAR(36) PRIMARY KEY,
    slug VARCHAR(128) NOT NULL UNIQUE,
    
    author_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

### 资源表
```sql
CREATE TABLE resources (
    name_hash CHAR(12) PRIMARY KEY,
    name_origin VARCHAR(255) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    article_uuid CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (article_uuid) REFERENCES articles(uuid) ON DELETE CASCADE,
    INDEX idx_article (article_uuid)
);
```

### 文件存储

`/var/lib/grassit/`

```
/var/lib/grassit/
├── files/
│   ├── articles/
│   │   └── {article-uuid}.md
│   └── resources/
│       └── {hash}.{ext}
└── avatars/
    └── {user-id}.jpeg
```

哈希算法：对 `slug + 原始文件名` 取 SHA-256，取前 12 位作为存储文件名。

---

## 接口规范

### 通用约定

- **版本**：所有接口前缀 `/api`，当前版本隐含为 v1（不加版本号）。
- **认证**：1.0 阶段暂不校验 token，`author_id` 固定为 `1`（管理员），返回的用户名固定为 `admin`。
- **日期格式**：`yyyy-MM-dd HH:mm:ss`（返回时使用 `yyyy-MM-dd` 仅用于示例，实际可包含时间）。
- **错误响应**：统一返回 JSON 格式 `{"code": 404, "message": "Not Found"}`，HTTP 状态码与业务码一致。
- **CORS**：开发环境通过 Vite 代理解决，生产环境由 Nginx 处理。

---

### GET `/api/user/:id`

> 当前阶段仅用于演示，后续会扩展更多字段。

**请求**：`GET /api/user/1`

**响应**（200 OK）：
```json
{
  "name": "admin"
}
```

---

### GET `/api/article/{identifier}`

**说明**：获取文章详细信息（不含正文）. 正则判断是uuid还是slug.

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876`

**响应**（200 OK）：
```json
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
  "slug": "my-article",
  "author_id": 1,
  "author_name": "admin",
  "created": "2026-09-01 10:00:00",
  "updated": "2026-09-02 14:30:00",
  "attachments": [
    {
      "url": "/resources/a1b2c3d4e5f6.png",
      "originalName": "sunny.png",
      "size": 2048576
    },
    {
      "url": "/resources/f6e5d4c3b2a1.zip",
      "originalName": "data.zip",
      "size": 512000
    }
  ]
}
```

若文章不存在，返回 `404`。

---

### GET `/api/article/:id/content`

**说明**：返回渲染后的 Markdown 内容(资源 URL 替换为哈希路径，站内链接替换为 slug 形式)。

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876/content`

**响应**：`Content-Type: text/markdown`，正文为处理后的 Markdown 字符串。

处理规则：
1. 读取md, 将原始资源引用(如 `![](sunny.png)`)替换为 `/resources/a1b2c3d4e5f6.png`。
2. 将站内链接（形如 `(https://grassit.cn)?/article/other-slug`）替换为 `/article/{对应uuid}`。

> 当前版本（0.x）可能暂不实现替换，留待 1.0 完善。

---

### GET `/api/article/:id/raw`

**说明**：获取原始 Markdown 文件内容（未经处理）。

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876/raw`

**响应**：`Content-Type: text/markdown`, 不做替换, 直接返回存储的内容。

---

### POST `/api/article/upload`

**说明**：上传文章及附件，创建新文章。

**请求**：`multipart/form-data`

| 字段      | 类型     | 描述                                              |
| --------- | -------- | ------------------------------------------------- |
| `files`   | 文件数组 | 包含一个 `main.md` 及其他资源文件                 |
| `slug`    | 字符串   | 文章 slug（必填, 唯一, 不能是合法的uuid）         |
| `author`  | 整数     | 作者 ID                                           |
| `created` | 字符串   | 创建日期（格式 `yyyy-MM-dd`，可选，默认当前时间） |

**存储与映射**：

1. 生成 UUID（v4）作为文章 ID。
2. 将 `main.md` 预处理: 将 Markdown 中站内文章链接（如 `[title](https://grassit.cn/article/some-slug)`）替换为 `[title](https://grassit.cn/article/{对应uuid})`
3. 上述内容保存到 `/var/lib/grassit/files/articles/{uuid}.md`。
4. 遍历其他文件，计算哈希(`slug + 原文件名`), 存储到 `/var/lib/grassit/files/resources/{hash}.{ext}`, 并添加数据库记录。
5. 插入 `articles` 表记录（`created_at` 和 `updated_at` 均为当前时间或传入值）。

**响应**（201 Created）：
```json
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876"
}
```