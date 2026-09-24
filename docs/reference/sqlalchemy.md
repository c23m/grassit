# SQLAlchemy 速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 实测环境：SQLAlchemy 2.0.54 + asyncmy + MySQL 9.4，文中写法均已实际跑通。
> 类型标注与 Pydantic 的对应关系见 [sqlalchemy-pydantic-types.md](sqlalchemy-pydantic-types.md)。

## 别忘了 await

`AsyncSession` 上的方法几乎都是协程：`execute`、`scalars`、`scalar`、`get`、`flush`、`commit`、`refresh`、`delete`、`rollback`。漏写 `await` 不会立刻抛错——拿到的是协程对象，而**协程对象恒为真**：

```python
if db.scalar(select(User).where(User.username == name)):     # 错：永远为真
    raise HTTPException(409)

if await db.scalar(select(User).where(User.username == name)):  # 对
    raise HTTPException(409)
```

运行时只会打出一条 `RuntimeWarning: coroutine 'AsyncSession.scalar' was never awaited`，接口却会安静地走错分支（实测：注册接口因此对任何输入都返回 409）。同步 API（如 `session.add`）不需要 `await`。

## 声明模型

```python
from datetime import datetime, timezone

from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow():
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True)
    nickname: Mapped[str] = mapped_column(String(60))
    created_at: Mapped[datetime] = mapped_column(default=utcnow)
    email: Mapped[str | None] = mapped_column(String(255), default=None)
```

- **可空性由标注决定**：`Mapped[str]` 生成 `NOT NULL`，`Mapped[str | None]` 生成可空列。漏写 `| None` 是新手最常见的建表意外。
- 列类型多数能从标注推导；要精确长度或特殊类型时显式写，如 `String(30)`、`Text`、`JSON`、`BigInteger`。
- 表级约束写 `__table_args__`，例如 `__table_args__ = (UniqueConstraint("a", "b"), Index("ix_name", "name"))`。
- `Base.metadata.create_all()` **只创建缺失的表，不会修改已存在的表结构**；改了列得重建表或引入迁移工具（Alembic）。

## 查询

```python
from sqlalchemy import func, select

# 按主键取一条
user = await session.get(User, 1)

# 条件取一条
user = await session.scalar(select(User).where(User.username == "ming"))

# 取多条
users = (
    await session.scalars(
        select(User).where(User.email.is_not(None)).order_by(User.id).limit(20)
    )
).all()

# 计数
total = await session.scalar(select(func.count()).select_from(User))

# 只取部分列，返回 Row 元组
rows = (await session.execute(select(User.id, User.username))).all()
```

| 调用                           | 返回                                                     |
| ------------------------------ | -------------------------------------------------------- |
| `await session.execute(stmt)`  | `Result`，多列查询用这个                                 |
| `await session.scalars(stmt)`  | `ScalarResult`，只取第一列，通常接 `.all()` / `.first()` |
| `await session.scalar(stmt)`   | 单个标量值或 `None`                                      |
| `await session.get(Model, pk)` | 按主键取实例，优先命中 identity map                      |

条件用 Python 运算符表达：`==`、`!=`、`.in_([...])`、`.like("x%")`、`.is_(None)`、`.is_not(None)`；组合用 `&` / `|`，每个条件都要加括号。1.x 的 `session.query(...)` 仍可用，但新代码统一用 `select()`。

## 写入与默认值

```python
obj = User(username="ming", nickname="小明", password_hash="...")
session.add(obj)             # 进入 unit of work
await session.commit()       # 先 flush 再提交，此时才真正落库

obj.nickname = "新昵称"       # 改属性不用手写 UPDATE
await session.commit()       # 提交时对比快照生成 SQL

await session.delete(obj)    # 删除
await session.commit()
```

`flush()` 只把待执行的 SQL 发出去，事务仍未提交；`commit()` 会先 flush 再提交。ORM 会跟踪实例状态，所以改完属性直接提交即可。

列默认值的生效时机并不一样：

| 默认值写在哪                        | 何时赋值               | 何时拿得到     |
| ----------------------------------- | ---------------------- | -------------- |
| `mapped_column(default=...)`        | flush 时由 Python 计算 | flush 之后     |
| `mapped_column(server_default=...)` | INSERT 时由数据库计算  | `refresh` 之后 |
| `__init__` 里手动赋值               | 构造对象时             | 立即           |

实测：`created_at: Mapped[datetime] = mapped_column(default=utcnow)` 这种写法，构造后是 `None`，`flush()` 后才得到 `2026-09-22 14:43:44.102980+00:00`，同时主键从 `None` 变成 `1`。**所以不要在 flush / commit 之前拿对象去拼响应体。**

`await session.refresh(obj)` 只在需要数据库侧生成的值（如 `server_default`、触发器结果）时使用。

## 关系与预加载

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship(back_populates="articles")


class User(Base):
    ...
    articles: Mapped[list["Article"]] = relationship(back_populates="author")
```

**异步下不要依赖懒加载**：没预加载就直接访问 `article.author`，会抛 `MissingGreenlet`——原因是同步 I/O 落在了不该发生的地方。两种解法：查询时显式预加载 `select(Article).options(selectinload(Article.author))`，或把关系声明成 `lazy="selectin"` 自动带出。

一对多集合还要防 N+1：循环里访问 `user.articles` 会逐个用户发一条查询，用 `selectinload` 一次取回。

| 关系参数                               | 作用                                       |
| -------------------------------------- | ------------------------------------------ |
| `back_populates`                       | 双向关系两侧互相指名，改一侧另一侧同步     |
| `lazy="selectin" / "joined" / "raise"` | 预加载策略；`raise` 用来强制必须显式预加载 |
| `cascade="all, delete-orphan"`         | 父对象删除时连带删除子对象                 |
| `secondary=`                           | 多对多所需的中间表                         |

## 会话与事务

session 自身就是事务边界：`commit()` 结束一个事务，`rollback()` 撤销。依赖注入里常见的写法只负责关闭与回滚，不负责提交：

```python
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

`async with` 退出时关闭 session，未提交的事务随之回滚——**提交必须由业务代码显式执行**，否则请求处理完数据就没了。

需要显式成块时：

```python
async with session.begin():
    session.add(obj)
```

出块时自动提交，出错自动回滚；注意它要求当前没有正在进行的显式事务，否则会报错。

另外，本项目的 sessionmaker 设了 `expire_on_commit=False`，提交后实例属性依然可读，不必立刻重新查询。

## 约束冲突

违反唯一、外键、非空约束时抛 `sqlalchemy.exc.IntegrityError`。关键点是异常之后 session 处于失效状态，**不 rollback 的话后续任何查询都会继续报错**：

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

唯一列允许 NULL 时，MySQL 与 PostgreSQL 都认为多个 NULL 互不冲突，所以“可选邮箱”这类字段留空不会互相打架；SQL Server 相反，只允许一个 NULL。
