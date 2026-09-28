# SQLAlchemy / Pydantic 类型对照

> 参考笔记（学习用），不是项目规范。

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

例如用户状态 `normal / banned / deleted`、文章可见性 `public / private`。

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

### 示例：模型与 schema 的对应

```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True)
    created_at: Mapped[datetime] = mapped_column(default=utcnow)


class UserBase(BaseModel):
    username: str
    created_at: date          # 注意：这里和模型不同，见「易错点」
```

**模型与 schema 的字段名必须对得上**。`model_validate(orm_obj)` 是按属性名取的，模型叫 `name` 而 schema 要 `username`，只会得到 `username Field required`。

如果 schema 配了 `alias_generator=to_camel`，JSON 里是 `createdAt`，Python 里仍是 `created_at`。

### 易错点：`datetime` 与 `date` 不能互转

Pydantic v2 的 `date` 字段只接受"时间为零点"的 `datetime`，带上时分秒会报：

```
Input should be a valid date ... Datetimes provided to dates should have zero time
```

（错误类型 `date_from_datetime_inexact`。）所以 ORM 里是 `DateTime`、schema 里是 `date` 时，必须显式转换：

- 手动转换：`created_at=obj.created_at.date()`
- 或在 schema 里加 `@field_validator("created_at", mode="before")`，把 `datetime` 截成 `date`，之后就能直接 `model_validate`

### 易错点：Pydantic 模型不能当元组解包

```python
username, nickname, password, email = user      # 错
```

Pydantic v2 的模型**可以**迭代，但每个元素是 `(字段名, 值)` 的元组（`dict(model)` 就是靠这个实现的）。所以上面这行只要字段数正好是 4 就不会报错，四个变量拿到的却是 `('username', 'v')` 这样的元组——一路带到 SQL 里会炸成 `Operand should contain 1 column(s)`，或者报 `too many values to unpack`（字段数对不上时）。实测参数长这样：

```
[parameters: (('username', 'reviewprobe'),)]
```

正确写法是按属性取值：

```python
username = user.username
nickname = user.nickname
```

需要整体转字典时用 `user.model_dump()`，键就是字段名。

推荐后者，写一次到处能用：

```python
from datetime import date, datetime

from pydantic import field_validator


class UserBase(BaseModel):
    username: str
    created_at: date

    @field_validator("created_at", mode="before")
    @classmethod
    def _truncate_to_date(cls, value):
        # datetime 是 date 的子类，必须先判 datetime
        if isinstance(value, datetime):
            return value.date()
        return value
```

几个要点：

- `mode="before"` 才会在 Pydantic 自身的 `date` 校验之前动手；用默认的 `after` 已经来不及（校验就失败了）
- `from_attributes=True` 时，校验器收到的是 ORM 对象上的原始属性值，所以 `model_validate(orm_obj)` 能直接通过
- 字段注解保持 `date`，输出才是 `2026-09-22`；想要完整时间就把注解改成 `datetime`
- **时区陷阱**：`v.date()` 取的是该 datetime 所在时区的日期。若库里存 UTC，而站点面向东八区，那么北京时间 00:30 发的文章（UTC 前一天 16:30）会显示成前一天。要按本地日期显示就得先转换：`value.astimezone(ZoneInfo("Asia/Shanghai")).date()`，或者干脆按本地时间存储

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

正则的写法、Pydantic `pattern` 的匹配语义与常见坑见 [regex.md](regex.md)。

`SecretStr` 打印时显示 `**********`，适合密码、token 这类字段；取值要用 `.get_secret_value()`，直接 `str(secret)` 只会得到掩码。

**核心一句**：数据库层全是 `VARCHAR`，格式校验在 Pydantic 层用 `EmailStr`、`AnyUrl` 这类类型做。
