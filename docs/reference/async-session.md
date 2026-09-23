# SQLAlchemy 异步 Session 速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 实测环境：SQLAlchemy 2.0.54 + asyncmy + MySQL 9.4。

## 写库四步

```python
obj = Model(...)             # 构造：id 与列默认值此时都还是 None
session.add(obj)             # 进入 unit of work
await session.commit()       # 先 flush 再提交，此时才真正落库
await session.refresh(obj)   # 仅在需要数据库侧生成的值时使用
```

`flush()` 与 `commit()` 的区别：flush 只把待执行的 SQL 发出去，事务仍未提交；commit 会先 flush 再提交。

## 默认值什么时候才有

| 默认值写在哪 | 何时赋值 | 需要什么才拿得到 |
| --- | --- | --- |
| `mapped_column(default=...)` | flush 时由 Python 计算 | flush 之后 |
| `mapped_column(server_default=...)` | INSERT 时由数据库计算 | `refresh` 之后 |
| `__init__` 里手动赋值 | 构造时 | 立即 |

实测：`created_at: Mapped[datetime] = mapped_column(default=utcnow)` 这种写法，构造后是 `None`，`flush()` 后得到 `2026-09-22 14:43:44.102980+00:00`，同时主键从 `None` 变成 `1`。

**推论**：不要在 flush / commit 之前拿对象去拼响应体。

## 事务边界

依赖注入里常见的写法只负责关闭与回滚，不负责提交：

```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

`async with` 退出时关闭 session，未提交的事务随之回滚。**提交必须由业务代码显式执行**，否则请求处理完数据就没了。

## IntegrityError 与回滚

违反唯一、外键、非空约束时，SQLAlchemy 抛 `sqlalchemy.exc.IntegrityError`。关键点在于异常之后 session 处于失效状态，不 rollback 的话后续任何查询都会继续报错：

```python
from sqlalchemy.exc import IntegrityError

try:
    session.add(obj)
    await session.commit()
except IntegrityError:
    await session.rollback()          # 必须
    raise HTTPException(status.HTTP_409_CONFLICT, "conflict")
```

插入前先 `select` 查重能给出更精确的提示，但查询与插入之间存在竞态，最终仍要以捕获异常为准。

## 唯一约束与 NULL

唯一列允许 NULL 时，MySQL 与 PostgreSQL 都认为多个 NULL 互不冲突，所以"可选邮箱"这类字段留空不会互相打架；SQL Server 相反，只允许一个 NULL。
