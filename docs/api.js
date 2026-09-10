export const api = [

    // 允许尾后斜杠, 即"/test"与"/test/" 匹配同一个
    // BaseURL: /api, 以下url都是相对与此的

    // 将来生产环境使用HTTPS协议
    // Authorization头: Bearer <token>

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
        // 创建用户
        method: "POST",
        target: "/auth/login",
        body: {
            username: "Hello",
            password: "admin-gst26",// 传输时密码明文, 存的时候不存明文
        },
        response: {
            status: 200,
            // 401: 用户名或密码错误
            body: {
                token: "..."// 返回token
            }
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
        // 返回已登录的
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
        // 返回用户的详细信息
        method: "GET",
        target: "/user/:username",

        response: {
            status: 200,
            body: {
                nickname: "ming",
                createdAt: "2026-09-01",
                avatar: "/avatar/1a1a1a1a1a1a.jpeg", // 可空
                email: "gst@example.com", // 可空
            }
        }
    },



    // ==================== article ====================

    {
        // 根据 ? 后的查询条件，返回符合条件的 article。没找到返回空数组即可。
        method: "GET",
        target: "/article",
        queryParams: [
            { name: "author", example: "ming" }, //用户名
            { name: "slug", example: "my-article" }, // 文章 slug
            { name: "uuid", example: "01234567-89ab-cdef-ffff-4321fedc9876" }, // 文章UUID
            { name: "start", example: "2026-09-01" }, // 查找创建时间在start及之后的文章
            { name: "end", example: "2026-09-13" }, // 查找创建时间在end及之前的文章
            { name: "tag", example: ["game", "ue5"] }, // 包含tag的文章(多个取交集)
        ],
        response: {
            status: 200,
            body: [
                {
                    uuid: "01234567-89ab-cdef-ffff-4321fedc9876",
                    slug: "my-article",
                    author: "admin",
                    title: "请输入文本",
                    createdAt: "2026-09-01 10:00:00",
                    updatedAt: "2026-09-02 14:30:00",
                    tags: ["game", "ue5"]
                }
            ]
        }
    },
    {
        // 获取文章详细信息。正则判断是uuid还是slug。处理规则：将站内链接(形如 /article/other-slug)替换为 /article/{对应uuid}；读取md，将原始资源引用(如 ![](sunny.png))替换为站内可用url。
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
                tags: [],
                attachments: []
            }
        },
    },
    {
        // 上传文章，创建新文章。
        method: "POST",
        target: "/article/upload",
        body: [
            content: "# 标题\n\n正文内容..." //
            slug: "my-article",  //文章 slug: 唯一, 仅包含小写字母与连字符, 不能是合法的uuid
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
    }
]