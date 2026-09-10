# 设计细节

- [设计细节](#设计细节)
  - [日志](#日志)
  - [接口](#接口)
  - [需求](#需求)
    - [用户](#用户)
    - [文章](#文章)
    - [存储](#存储)


## 日志

修改了上传文章的接口路径与查询参数

增加了登出, 删除用户与删除文章接口


## 接口

允许尾后斜杠, 即"/test"与"/test/" 匹配同一个  
BaseURL: `/api`, 以下url都是相对与此的

生产环境用`/api`,  
开发环境用`https://api.grassit.cn`

将来生产环境使用HTTPS协议  
Authorization头: `Bearer <token>`  
access token: 15min 过期  
refresh token: 30days 过期

```js
[

    // ==================== test ====================

    {
        // 返回测试内容，包括当前时间和版本
        method: "GET",
        target: "/test",
        response: {
            status: 200,
            body: {
                time: "2026-09-04 08:22:44",
                version: "0.1.0.1"
            }
        }
    },

    // ==================== auth ====================

    {
        // 登录
        method: "POST",
        target: "/auth/login",
        body: {
            username: "Hello",
            password: "admin-gst26",
        },
        response: {
            status: 200,
            // 401: 用户名或密码错误
            // Set-Cookie...
            body: {
                token: "..."// 返回access token
            }
        }
    },
    {
        // 登出
        method: "GET",
        target: "/auth/logout",
        response: {
            status: 200
        }
    },
    {
        // 注册
        method: "POST",
        target: "/auth/register",
        body: {
            username: "Hello",
            nickname: "Hi",
            password: "admin-gst26",
            email: "example@gmail.com", // 可空
        },
        response: {
            status: 201
            // 400: 参数缺少或类型/格式错误等
            // 409: 用户名已存在
            // 422: 包含非法字符, 邮箱格式错误等
        }
    },
    {
        // 返回已登录的用户信息
        method: "GET",
        target: "/auth/me",
        response: {
            status: 200,
            // 401: 未登录
            body: {
                username: "ming",
                nickname: "小明",
                createdAt: "2026-09-01",
                avatar: "/avatar/1a1a1a1a1a1a.jpeg", // 可空
                email: "gst@example.com", // 可空
            }
        }
    },
    {
        // 得到新的access token
        method: "POST",
        target: "/auth/refresh",
        response: {
            status: 200,
            // Set-Cookie...
            body: {
                token: "..."
            }
        }
    },
    

    // ==================== user ====================

    {
        // 返回用户的详细信息
        method: "GET",
        target: "/user/:username",
        response: {
            status: 200,
            body: {
                nickname: "ming",
                createdAt: "2026-09-01",
                avatar: "/avatar/1a1a1a1a1a1a.jpeg", // 可空
            }
        }
    },
    {
        // 管理员直接删除用户(及其创建的文章与头像等)
        // 需要管理员权限(假设现在有且只有admin有权限)
        method: "DELETE",
        target: "/user/:username",
        response: {
            status: 204
            //403
        }
    },

    // ==================== article ====================

    {
        // 根据 ? 后的查询条件，返回符合条件的 article。没找到返回空数组即可。
        method: "GET",
        target: "/article",
        queryParams: {
            author: "ming",         // 用户名
            title: "Hello"          // 返回所有包含的, 比如标题为"Hello world"的也匹配
            slug: "my-" ,           // 同上, 返回所有包含的
            start: "2026-09-01",    // 查找创建时间在start及之后的文章
            end: "2026-09-13",      // 查找创建时间在end及之前的文章
            tags: ["game", "ue5"],  // 包含tag的文章(多个取交集)
        },
        response: {
            status: 200,
            body: {
                uuid: "01234567-89ab-cdef-ffff-4321fedc9876",
                slug: "my-article",
                author: "admin",
                title: "请输入文本",
                createdAt: "2026-09-01 10:00:00",
                updatedAt: "2026-09-02 14:30:00",
                tags: ["game", "ue5"]
            }

        }
    },
    {
        // 获取文章详细信息。
        // 正则判断是uuid还是slug。
        // 处理时将站内链接(形如 /article/other-slug)替换为 /article/{对应uuid}
        method: "GET",
        target: "/article/:identifier",
        response: {
            status: 200,
            // 404: 不存在
            body: {
                uuid: "01234567-89ab-cdef-ffff-4321fedc9876",
                slug: "my-article",
                author: {
                    username: "admin",
                    nickname: "管理员"
                },
                title: "标题内容",
                createdAt: "2026-09-01 10:00:00",
                updatedAt: "2026-09-02 14:30:00",
                content: "# 一级标题\n\n正文内容...\n\n## 二级标题...",
                tags: ["test", "grassit", "gst"],
            }
        },
    },
    {
        // 创建新文章
        method: "POST",
        target: "/article",
        body: [
            content: "# 标题\n\n正文内容..." //
            slug: "my-article",  // 格式详见需求-文章
            title: "标题内容", //
            author: "ming"// 作者用户名
        ],
        // 生成 UUID(v4) 作为文章 ID。
        // 将 main.md 预处理: 将 Markdown 中站内文章链接（如 [title](/article/some-slug)）替换为 [title](/article/{对应uuid})。
        // 上述内容保存。遍历其他文件，计算哈希后, 存储记录。
        response: {
            status: 201
            // 400: 参数错误
            // 409: 存在slug相同的文章
            // 422: slug格式不正确
        }
    },
    {
        // 删除文章, 作者才能成功
        method: "DELETE",
        target: "/article/:identifier",
        response: {
            status: 204
            //403
        }
    }
]
```

## 需求

### 用户
1. 需要记录用户名称(username), 唯一且必需, 不能改变. 不超过30个字符, 只允许`(a-z)|(A-Z)|(0-9)|-|_`, 不能以`-|_`开头.
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
1. 每个文章有唯一的uuid与slug, 均不能重复. uuid不变, slug可能变更. 其中slug的最大长度是128字符, 只包含小写字母和连字符.
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
