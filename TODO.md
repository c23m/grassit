# TODO

## 目录
- [TODO](#todo)
  - [目录](#目录)
  - [日志](#日志)
  - [注意事项](#注意事项)
  - [版本](#版本)
    - [0.0.0](#000)
    - [0.0.1](#001)
    - [0.0.2](#002)
    - [0.0.3](#003)
    - [0.1.0](#010)
    - [0.1.1](#011)
    - [0.1.2](#012)
    - [0.1.3](#013)
    - [0.2](#02)
  - [需求](#需求)
    - [概述](#概述)
    - [用户](#用户)
    - [文章](#文章)
    - [存储](#存储)
  - [接口](#接口)
    - [`GET /api/test`](#get-apitest)
    - [`GET /api/user/:username`](#get-apiuserusername)
    - [`POST /api/user/register`](#post-apiuserregister)
    - [`GET /api/article`](#get-apiarticle)
    - [`GET /api/article/:identifier`](#get-apiarticleidentifier)
    - [`GET /api/article/:identifier/raw`](#get-apiarticleidentifierraw)
    - [`POST /api/article/upload`](#post-apiarticleupload)

## 日志

**时间**: 9/5

**版本**: 0.0.2


更改了一处接口: [`GET /api/test`](#get-apitest)

将本文档url参数样式从`/{username}`改为了`/:username`



## 注意事项

1. 开始工作前, 先拉取最新版本的TODO.md, 查看日志.

本文的描述里, 
- [ ] 这种样式的内容表示需要做
- [x] 这种样式的内容表示已实现
> - [ ] 这种样式的内容表示优先级低



## 版本

### 0.0.0

- [x] 网站已经可以照常运行了.

### 0.0.1

- [x] 实现主页. 

- [x] 可以从主页的导航栏正常跳转到/test页. 

- [x] test页会向后端询问当前时间, 返回即可. 

**参考**:
[`GET /api/test`](#get-apitest)

### 0.0.2

- [x] 实现了文档查看页.
- [x] 添加测试数据

测试用例与说明: 

[测试文档1](../storage/test/v0-0-2-0.md)

[测试文档2](../storage/test/v0-0-2-1.md)

**参考**:
[`GET /api/article/:identifier`](#get-apiarticleidentifier)

### 0.0.3

前端:

- [ ] 完善test页.

后端:

可以在这个版本可以提前处理用户了

### 0.1.0

从本版本开始, 需要处理用户

- [ ] 可以根据用户名得到昵称和头像
- [ ] 可以注册

**参考**:

[`POST /api/user/register`](#post-apiuserregister)

[`GET /api/user/:username`](#get-apiuserusername)

### 0.1.1

- [ ] 可以登录

### 0.1.2

- [ ] 在登陆状态上传文档, 不带附件
- [ ] 添加测试数据

**参考**:
[`POST /api/article/upload`](#post-apiarticleupload)

### 0.1.3

- [ ] 修改文档
- [ ] 删除文档

### 0.2

优化体验, 如添加目录功能.
...

## 需求

### 概述
1. 前端在查询时不会请求和使用任何id(如`3`这类), 文章的uuid除外.
2. 由于需求变动, 前面的表不适用了, 但可以在`/storage/test/database.md`查看. 在这里我在下方提供需要使用的数据, 自行实现需要的表和表结构.
3. 上传的文件如何存储, 自行决定. 需要文件的时候, 总是返回完整的可用url(如`/files/a1b2c3d4e5f6.jpeg`)

### 用户
1. 需要记录用户名称(username), 唯一且必需. 不超过30个字符. 不能改变.
2. 需要记录用户昵称(不超过30字符, 必需, 不唯一, 可变)
3. 需要记录用户创建时间(精确到日)
4. 需要记录用户的上次在线时间(精确到分)与在线状态(在线/离线).
5. 需要记录每个用户的头像的url. 可以为空
6. 需要记录用户账号状态. 可能如下几种
    - 正常
    - 封禁中
    - 已注销
7. 封禁的用户能被搜索, 并显示出封禁状态, 但已注销的不能, 且不可见. 注销后, 发布过的文章仍然存在, 且能正常访问. 仍然不能让新注册的用户名取为某个注销的用户的用户名

### 文章
1. 每个文章有唯一的uuid与slug, 均不能重复. uuid不变, slug可能变更.其中slug的最大长度是128字符.
2. 需要记录每个文章的创建时间与更新时间, 至少精确到分.
3. 需要记录一个文章拥有的标签集合(tags), 并能通过拥有的标签查找指定的文章.
4. 需要记录用户. 如果文章属于一个注销账户的用户, 用户名显示"已注销用户".
5. 需要记录文章的字数(UTF-8的字符数)
6. 文章可以被删除. 删除的文章应该被物理删除, 也就是:
    - slug 释放, 其他文章可以取这个slug
    - 无法通过uuid或者slug等任何手段访问到文章, 因为已经删除了.
7. 可以设置可见性. 设置为公开的可以被任意访问, 设置为私密的, 只有作者可以访问或搜索到.

### 存储

开发: `/storage/`

生产: `/var/lib/grassit/`

现阶段来说, 公开资源的url可能如下:
- (/storage/等存储路径下)
  - public/
    - static/
    - avatars/
    - attachments/


哈希算法参考：对 `slug + 原始文件名` 取 SHA-256，取前 12 位作为存储文件名。


## 接口

字段默认必需, 若可选会声明

错误响应统一返回 JSON 格式 `{"code": 404, "message": "Not Found"}`，HTTP 状态码与业务码一致。


CORS: 开发环境通过 Vite 代理解决，生产环境由 Nginx 处理。

---
### `GET /api/test`

`GET /api/`返回和这个一样的内容

返回一些测试内容, 包括:
1. 当前时间(`yyyy-MM-dd HH:mm:ss`).
2. 版本(前三位与[日志](#日志)的版本相同, 最后一位按需变动)

响应 (200 OK):
```json
{
  "time": "2026-09-04 08:22:44",
  "version": "0.0.2.1"
}
```


### `GET /api/user/:username`

- [ ] 返回用户的详细信息.

> - [ ] 后续添加更多信息

响应(200 OK):
```json
{
  "nickname": "ming",
  "createdAt": "2026-09-01",
  "avatar": "/files/{sth}.jpeg"
}
```

### `POST /api/user/register`

- [ ] 创建用户

```json
{
  "username": "Hello",
  "nickname": "Hi",
  "passwordHash": "...",
  "email": "example@gmail.com" //可选
}
```

成功响应: 201

暂时不需要其他返回

---

### `GET /api/article`
>- [ ] 根据`?`后的查询条件, 返回符合条件的article. 没找到返回空数组即可.

| 查询参数 | 示例值       | 描述                                 |
| -------- | ------------ | ------------------------------------ |
| `author` | `ming`       | 用户id                               |
| `slug`   | `my-article` | 文章 slug                            |
| `uuid`   | 略           | 文章UUID                             |
| `start`  | `2026-09-01` | 查找创建时间在start及之后的文章      |
| `end`    | `2026-09-13` | 查找创建时间在end及之前的文章        |
| `tag`    | `game`       | 包含此tag的文章(暂时只选一个tag查找) |


```json
[
  {
    "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
    "slug": "my-article",
    "author": "admin",
    "title": "请输入文本",
    "createdAt": "2026-09-01 10:00:00",
    "updatedAt": "2026-09-02 14:30:00",
    "tags": [
      "game", "ue5"
    ]
  }
]
```

---

### `GET /api/article/:identifier`

- [ ] 获取文章详细信息.

- [ ] 正则判断是uuid还是slug.

处理规则：

- [ ] 将站内链接(形如`/article/other-slug`)替换为 `/article/{对应uuid}`。

> - [ ] 读取md, 将原始资源引用(如 `![](sunny.png)`)替换为站内可用url。

响应 (200 OK)：
```json
{
  "uuid": "01234567-89ab-cdef-ffff-4321fedc9876",
  "slug": "my-article",
  "author": {
    "username": "admin",
    "nickname": "管理员"
  },
  "title": "标题内容",
  "createdAt": "2026-09-01 10:00:00",
  "updatedAt": "2026-09-02 14:30:00",
  "content": "# 一级标题\n\n正文内容...\n\n## 二级标题...",
  "tags": [
    // 0.2.x 再实现标签
    //"game", "ue5"
  ],
  "attachments": [
    // 0.3.x再实现附件
    // {
    //   "url": "/attachments/f6e5d4c3b2a1.zip",
    //   "originalName": "sunny.png",
    //   "size": 2048576
    // },
    // {
    //   "url": ...,
    //   "originalName": "data.zip",
    //   "size": 512000
    // }
  ]
}
```

若文章不存在，返回 `404`。


---

### `GET /api/article/:identifier/raw`

> - [ ] 获取原始 Markdown 文件内容。

**请求**：`GET /api/article/01234567-89ab-cdef-ffff-4321fedc9876/raw`

**响应**：`Content-Type: text/markdown`, 不做替换, 直接返回存储的内容。

---

### `POST /api/article/upload`

- [ ] 上传文章，创建新文章。

> - [ ] 可以一并上传附件

**请求**：`multipart/form-data`

| 字段        | 类型     | 描述                                            |
| ----------- | -------- | ----------------------------------------------- |
| `files`     | 文件数组 | 包含一个 `main.md` 及其他资源文件               |
| `slug`      | 字符串   | 文章 slug（必填, 唯一, 不能是合法的uuid）       |
| `title`     | 字符串   | 标题                                            |
| `author`    | 字符串   | 作者用户名                                      |
| `createdAt` | 字符串   | 创建时间(`yyyy-MM-dd HH:mm:ss`), 默认当前时间） |

当前: 文件只包含main.md, 不包含其他附件.

- [ ] 生成 UUID（v4）作为文章 ID。
- [ ] 将 `main.md` 预处理: 将 Markdown 中站内文章链接（如 `[title](/article/some-slug)`）替换为 `[title](/article/{对应uuid})`
- [ ] 上述内容保存。
> - [ ] 遍历其他文件，计算哈希后, 存储记录。

**响应** (201 Created)








