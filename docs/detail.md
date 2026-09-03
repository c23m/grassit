# 设计细节

- [设计细节](#设计细节)
  - [接口](#接口)
    - [GET `/api/test/time/now`](#get-apitesttimenow)
    - [GET `/api/user/:id`](#get-apiuserid)
    - [GET `/api/article?...`](#get-apiarticle)
    - [GET `/api/article/{identifier}`](#get-apiarticleidentifier)
    - [GET `/api/article/{identifier}/raw`](#get-apiarticleidentifierraw)
    - [POST `/api/article/upload`](#post-apiarticleupload)
  - [表结构](#表结构)
    - [用户表](#用户表)
    - [文章表](#文章表)
    - [资源表](#资源表)
    - [标签表](#标签表)
    - [文章-标签 关联表](#文章-标签-关联表)
  - [文件存储](#文件存储)
  - [规范](#规范)
    - [分支](#分支)
      - [`main`](#main)
      - [`dev`](#dev)
      - [`tmp`](#tmp)


## 接口

**通用约定**:

- **前缀**：所有接口前缀 `/api`。
- **认证**：1.0 阶段暂不校验 token，`author_id` 固定为 `1`（管理员），返回的用户名固定为 `admin`。
- **日期格式**：`yyyy-MM-dd HH:mm:ss`（返回时使用 `yyyy-MM-dd` 仅用于示例，实际可包含时间）。
- **错误响应**：统一返回 JSON 格式 `{"code": 404, "message": "Not Found"}`，HTTP 状态码与业务码一致。
- **CORS**：开发环境通过 Vite 代理解决，生产环境由 Nginx 处理。

---

### GET `/api/test/time/now`

**响应** (200 OK):

返回当前时间(`yyyy-MM-dd HH:mm:ss`).

```json
{
  "time": "2026-09-04 08:22:44"
}
```

### GET `/api/user/:id`


> 暂时跳过这个  
> 当前阶段仅用于演示，后续会扩展更多字段。

**请求**：`GET /api/user/1`

**响应**（200 OK）：
```json
{
  "name": "admin"
}
```

---

### GET `/api/article?...`

返回符合条件的article. 没找到返回空数组即可.

| 查询参数 | 示例值       | 描述                                                          |
| -------- | ------------ | ------------------------------------------------------------- |
| `author` | `1`          | 用户id                                                        |
| `slug`   | `html`       | 文章 slug                                                     |
| `uuid`   | 略           | 文章UUID                                                      |
| `start`  | `2026-09-01` | 查找createdtime 在 [start, end]时间内的文章, 默认`1970-01-01` |
| `end`    | `2026-09-13` | 默认current time                                              |
| `tag`    | `game`       | 以后再给文章打tag列表                                         |

```json
[
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
  "slug": "my-article",
  "authorId": 1, // 暂时总是1
  "authorName": "admin",  // 暂时总是"admin"
  "createdAt": "2026-09-01 10:00:00",
  "updatedAt": "2026-09-02 14:30:00",
}
]
```

### GET `/api/article/{identifier}`

**说明**：获取文章详细信息. 正则判断是uuid还是slug.

处理规则：
1. 读取md, 将原始资源引用(如 `![](sunny.png)`)替换为 `/resources/a1b2c3d4e5f6.png`。
2. 将站内链接（形如 `(https://grassit.cn)?/article/other-slug`）替换为 `/article/{对应uuid}`。

> 当前版本（0.x）可能暂不实现替换，留待 1.0 完善。

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876`

**响应** (200 OK)：
```json
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
  "slug": "my-article",
  "authorId": 1, // 暂时总是1
  "authorName": "admin",  // 暂时总是"admin"
  "createdAt": "2026-09-01 10:00:00",
  "updatedAt": "2026-09-02 14:30:00",
  "content": "# 一级标题\n\n正文内容...\n\n## 二级标题...",
  "tags": [
    { "id": 22,
      "nameZh": "中",
      "nameEn": "Eng"
    }
  ]
  "attachments": [
    // 下面内容可以暂时置空
    // {
    //   "url": "/resources/a1b2c3d4e5f6.png",
    //   "originalName": "sunny.png",
    //   "size": 2048576
    // },
    // {
    //   "url": "/resources/f6e5d4c3b2a1.zip",
    //   "originalName": "data.zip",
    //   "size": 512000
    // }
  ]
}
```

若文章不存在，返回 `404`。

---

### GET `/api/article/{identifier}/raw`

**说明**：获取原始 Markdown 文件内容。

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876/raw`

**响应**：`Content-Type: text/markdown`, 不做替换, 直接返回存储的内容。

---

### POST `/api/article/upload`

**说明**：上传文章及附件，创建新文章。

**请求**：`multipart/form-data`

| 字段        | 类型     | 描述                                              |
| ----------- | -------- | ------------------------------------------------- |
| `files`     | 文件数组 | 包含一个 `main.md` 及其他资源文件                 |
| `slug`      | 字符串   | 文章 slug（必填, 唯一, 不能是合法的uuid）         |
| `authorId`  | 整数     | 作者 ID                                           |
| `createdAt` | 字符串   | 创建日期（格式 `yyyy-MM-dd`，可选，默认当前时间） |

当前: 文件只包含main.md, 不包含其他附件.


**存储与映射**：

1. 生成 UUID（v4）作为文章 ID。
2. 将 `main.md` 预处理: 将 Markdown 中站内文章链接（如 `[title](https://grassit.cn/article/some-slug)`）替换为 `[title](https://grassit.cn/article/{对应uuid})`
3. 上述内容保存到 `/var/lib/grassit/files/articles/{uuid}.md`。
> 下面第4步先跳过  
4. 遍历其他文件，计算哈希(`slug + 原文件名`), 存储到 `/> var/lib/grassit/files/resources/{hash}.{ext}`, 并添加数据库记录。
5. 插入 `articles` 表记录。

**响应**（201 Created）：
```json
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876"
}
```

## 表结构

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

```sql
CREATE TABLE articles (
    uuid CHAR(36) PRIMARY KEY,
    slug VARCHAR(128) NOT NULL UNIQUE,
    title VARCHAR(128) NOT NULL,
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

### 标签表
```sql
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_zh VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL
);
```

### 文章-标签 关联表
```sql
CREATE TABLE article_tags (
    article_uuid CHAR(36) NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (article_uuid, tag_id)
    FOREIGN KEY (article_uuid) REFERENCES articles(uuid) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## 文件存储

开发环境: `/storage/`, 如下

- grassit/
  - frontend/
  - backend/
  - storage/
    - database/
    - avatars/
      - {user-id}.jpeg
    - articles/
      - {article-uuid}.md
    - resources/
      - {hash}.{ext}

生产: `/var/lib/grassit/`

哈希算法：对 `slug + 原始文件名` 取 SHA-256，取前 12 位作为存储文件名。

## 规范

### 分支

#### `main`
完整实现了某个功能, 通过了测试.

#### `dev`
可以运行才提交到这个分支.

#### `tmp`
半成品代码, 随便提交