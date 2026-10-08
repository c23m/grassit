# 后端引用说明

> 这个目录放**与后端当前工作直接相关**的文档：规范与任务指南（任务做完、代码里已经有答案的就删掉），目前都还没有。不绑任务的速查表与旧文在 [docs/reference/](../reference/)，本文件说明这边引用了哪些——**当前任务在用的在上，全部引用在下**。
> 参考件不是规范，结论以代码和实测为准。

## 当前任务（0.0.4 · 鉴权与前端登录态）

无。0.0.4 是前端的事，后端部分已在 0.0.3 完成；这一节将来要列当前任务需要读的后端参考件。

## 全部引用

- [project-primer.md](../reference/project-primer.md)——面向零基础的项目知识导读（概述 / 前端 / 后端 / 部署 / 配置 / 工程与流程），后端那 20 条也在里面
- [sqlalchemy.md](../reference/sqlalchemy.md)——ORM 思路、Model、Engine 与 Session、CRUD、查询与表关系
- [sqlalchemy-pydantic-types.md](../reference/sqlalchemy-pydantic-types.md)——SQLAlchemy 字段类型与 Pydantic 类型的对应关系
- [regex.md](../reference/regex.md)——正则速查，以及 Pydantic `pattern` 的匹配语义（是否全匹配）
- [jwt.md](../reference/jwt.md)——JWT 结构、签名与校验，access / refresh 靠 payload 区分（0.0.5 会用到）
