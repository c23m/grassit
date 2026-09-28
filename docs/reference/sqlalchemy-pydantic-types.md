# SQLAlchemy / Pydantic 类型对照

> 参考笔记（学习用），不是项目规范。项目的实际字段以 `backend/app/` 的代码为准。

分三层：**数据库列类型**、**ORM 类型标注**、**Pydantic 类型**。email 在数据库层就是普通字符串，只在 Pydantic 层有特殊格式。

### 完整对照表

| 语义       | SQLAlchemy ORM 标注                      | MySQL 列类型        | Pydantic 类型   | 说明                 |
| ---------- | ---------------------------------------- | ------------------- | --------------- | -------------------- |
| 整数主键   | `Mapped[int]` + `primary_key=True`       | `INT`               | `int`           | 自增                 |
| 整数       | `Mapped[int]`                            | `INT`               | `int`           |                      |
| 大整数     | `Mapped[int]`                            | `BIGINT`            | `int`           | 用 `BigInteger`      |
| 布尔       | `Mapped[bool]`                           | `TINYINT(1)`        | `bool`          |                      |
| 短字符串   | `Mapped[str]` + `String(50)`             | `VARCHAR(50)`       | `str`           | 用户名、昵称         |
| 中等字符串 | `Mapped[str]` + `String(255)`            | `VARCHAR(255)`      | `str`           | slug、邮箱、头像路径 |
| 长文本     | `Mapped[str]` + `Text`                   | `TEXT`              | `str`           | 文章内容             |
| **邮箱**   | `Mapped[str]` + `String(255)`            | `VARCHAR(255)`      | `EmailStr`      | **见下方**           |
| UUID       | `Mapped[str]` + `String(36)`             | `CHAR(36)`          | `UUID` 或 `str` |                      |
| 日期       | `Mapped[date]`                           | `DATE`              | `date`          |                      |
| 时间       | `Mapped[time]`                           | `TIME`              | `time`          |                      |
| 日期时间   | `Mapped[datetime]`                       | `DATETIME`          | `datetime`      |                      |
| 可空字符串 | `Mapped[str \| None]`                    | `VARCHAR(...) NULL` | `str \| None`   |                      |
| JSON       | `Mapped[dict]` + `JSON`                  | `JSON`              | `dict`          |                      |
| 枚举       | `Mapped[str]` + `String(20)`             | `VARCHAR(20)`       | `Literal[...]`  | 见下方               |
| 外键       | `Mapped[int]` + `ForeignKey("users.id")` | `INT`               | —               | 不直接暴露           |
| 关系       | `Mapped[list["X"]]` + `relationship()`   | 无列                | `list[X]`       | 对象导航             |

**需要额外安装**：

```bash
pip install "pydantic[email]"
```

底层是 `email-validator` 包。

### 枚举写法

`docs/` 里用户状态有 `normal / banned / deleted`，文章可见性有 `public / private`（当前 `backend/app/models/` 中尚未实现这些列）。

**数据库层：字符串**

```python
status: Mapped[str] = mapped_column(String(20), default="normal")
```

**Pydantic 层：用 `Literal`**

```python
from typing import Literal

class UserMe(BaseModel):
    username: str
    status: Literal["normal", "banned", "deleted"]
```

或定义枚举类：

```python
from enum import StrEnum

class UserStatus(StrEnum):
    NORMAL = "normal"
    BANNED = "banned"
    DELETED = "deleted"

class UserMe(BaseModel):
    status: UserStatus
```

`Literal` 更简单，`StrEnum` 更适合复用。

### 你项目的具体字段

```python
# backend/app/schemas/auth.py
from pydantic import EmailStr, Field, SecretStr

from app.schemas import BaseSchema


class RegisterRequest(BaseSchema):
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z-_]+$")
    nickname: str = Field(min_length=1)
    password: SecretStr = Field(min_length=6)
    email: EmailStr | None = None
```

```python
# backend/app/schemas/user.py
from datetime import date

from pydantic import EmailStr

from app.schemas import BaseSchema


class UserBase(BaseSchema):
    username: str
    nickname: str
    avatar: str | None = None
    created_at: date


class UserMe(UserBase):
    email: EmailStr | None = None
    github: str | None = None
```

```python
# backend/app/models/user.py
from datetime import datetime, timezone

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), unique=True)
    nickname: Mapped[str] = mapped_column(String(60))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(default=utcnow)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, default=None)
```

> **注意**：模型里的 `name` 对应设计文档中的 `username`；`uuid`、`avatar`、`github`、`status`、`last_online_at`、`is_online`、`updated_at` 等字段尚未实现。
> `BaseSchema` 使用 `alias_generator=to_camel`，所以 JSON 里是 `createdAt`，Python 里是 `created_at`。

### 关键点

**数据库不区分“邮箱”和“普通字符串”**，都是 `VARCHAR`。校验在 Pydantic 层做。

**`EmailStr` 只在 Pydantic 里用**，不要试图在 SQLAlchemy 模型里用它，SQLAlchemy 不认。

**响应模型里 email 也可以直接 `str`**，因为数据库里的值已经校验过了，不用再校验一遍：

```python
class UserMe(BaseModel):
    email: str | None = None   # 也行，因为存进去时已经校验过
```

但用 `EmailStr` 更严格，输出时也保证格式。看个人偏好，**输入用 `EmailStr` 是必须的，输出用 `str` 也够**。

### 其他常见格式

| 格式   | Pydantic 类型        | 需装 |
| ------ | -------------------- | ---- |
| URL    | `AnyUrl` / `HttpUrl` | 无   |
| IPv4   | `IPv4Address`        | 无   |
| IPv6   | `IPv6Address`        | 无   |
| 颜色   | 自定义 pattern       | —    |
| 手机号 | 自定义 pattern       | —    |
| 密码   | `str` + `SecretStr`  | 无   |

`SecretStr` 打印时显示 `**********`，适合密码字段的日志安全，但 API 输入输出一般直接用 `str`。

**核心一句**：数据库层全是 `VARCHAR`，格式校验在 Pydantic 层用 `EmailStr`、`AnyUrl` 这类类型做。