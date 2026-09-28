# 后端引用说明

> 这个目录放**与后端当前工作直接相关**的文档（目前还没有这样的文档）。参考件都在 [docs/reference/](../reference/)：学习笔记、速查、以及已被代码取代的旧文。本文件说明这边引用了哪些参考件——**当前任务在用的在上，全部引用在下**。
> 参考件不是规范，结论以代码和实测为准。

## 当前任务（0.0.4 · 鉴权与前端登录态）

无。0.0.4 是前端的事，后端部分已在 0.0.3 完成；这一节将来要列当前任务需要读的后端参考件。

## 全部引用

动手前可能用到的：

- [sqlalchemy.md](../reference/sqlalchemy.md)——ORM 思路、Model、Engine 与 Session、CRUD、查询与表关系
- [sqlalchemy-pydantic-types.md](../reference/sqlalchemy-pydantic-types.md)——SQLAlchemy 字段类型与 Pydantic 类型的对应关系
- [regex.md](../reference/regex.md)——正则速查，以及 Pydantic `pattern` 的匹配语义（是否全匹配）
- [jwt.md](../reference/jwt.md)——JWT 结构、签名与校验，access / refresh 靠 payload 区分（0.0.5 会用到）

已被代码取代，只作备查：

- [configuration.md](../reference/configuration.md)——pydantic-settings 与 `.env` 的优先级，实现见 `backend/app/config.py`
- [password-hashing.md](../reference/password-hashing.md)——pwdlib + argon2 的用法，实现见 `backend/app/security.py`
