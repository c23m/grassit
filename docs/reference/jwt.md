# JWT 速查

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 实测环境：PyJWT 2.14.0。

## 长什么样

三段用 `.` 连接：`header.payload.signature`。实测一个 HS256 token 共 120 字符，header 解出来是 `{"alg": "HS256", "typ": "JWT"}`。

**payload 只是 Base64URL 编码，不是加密**：任何人拿到 token 都能解开看内容（`jwt.decode(token, options={"verify_signature": False})`）。签名保证的是"没被改过"，不是"别人看不到"。所以别往里面放密码之类的敏感数据。

## 签发与校验

```python
import datetime

import jwt

now = datetime.datetime.now(datetime.timezone.utc)
token = jwt.encode(
    {"sub": "42", "exp": now + datetime.timedelta(minutes=15)},
    settings.jwt_secret,
    algorithm="HS256",
)

payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
```

`decode` 的第三个参数实测**直接传字符串 `"HS256"` 也会被接受**（PyJWT 内部会归一化），但文档写法是传列表，统一用列表即可。

## 校验失败抛什么（实测）

| 情况                       | 异常                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| 已过期                     | `ExpiredSignatureError: Signature has expired`                                       |
| 密钥不对                   | `InvalidSignatureError: Signature verification failed`                               |
| payload 被改过             | `InvalidSignatureError`                                                              |
| `decode` 没传 `algorithms` | `DecodeError: It is required that you pass in a value for the "algorithms" argument` |
| `sub` 不是字符串           | `InvalidSubjectError: Subject must be a string`                                      |

它们都继承自 `jwt.exceptions.InvalidTokenError`，路由里可以一把抓：

```python
from jwt.exceptions import InvalidTokenError

try:
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
except InvalidTokenError:
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid token")
```

## `exp` 必须是"带时区"的时间

PyJWT 对 naive datetime **按 UTC 解释**。实测传 `datetime(2026, 1, 1, 12, 0)`（无时区）时，存下来的时间戳是 `1767268800`——正好是 "12:00 UTC"；而东八区的 12:00 应该是 `1767240000`，差了整整 8 小时。

```python
now = datetime.datetime.now(datetime.timezone.utc)   # 对
now = datetime.datetime.now()                        # 错：被当 UTC，过期时间凭空多了 8 小时
```

## 常见声明

| 声明          | 含义                                                      |
| ------------- | --------------------------------------------------------- |
| `sub`         | 主体，通常是用户标识；**必须是字符串**（传 int 直接报错） |
| `exp`         | 过期时间，PyJWT 默认校验                                  |
| `iat`         | 签发时间                                                  |
| `nbf`         | 在此之前无效                                              |
| `jti`         | 唯一 ID，可用于黑名单或防重放                             |
| `aud` / `iss` | 受众 / 签发者，多服务场景下用来限定用途                   |

自定义字段随便加，但内容明文可见。放用户 id 到 `sub` 通常就够——邮箱、昵称这类每次查库就能拿到，没必要塞进 token。

## 密钥

- HS256 是**对称**算法：同一个密钥既签发又校验，泄露即可伪造任意用户
- 实测密钥短于 32 字节时 PyJWT 会发 `InsecureKeyLengthWarning`（RFC 7518 建议 SHA256 至少 32 字节），所以用 `secrets.token_urlsafe(32)` 生成
- `decode` 一定要显式传 `algorithms=[...]`，别让它按 token 里写的 `alg` 自己决定
- 换密钥意味着已签发、尚未过期的 token 全部失效

## 为什么还要 refresh token

JWT 是**无状态**的：签出去之后、过期之前一直有效，没法单独撤销（除非另建黑名单，那又变成有状态了）。所以常见做法是"短命 access token（分钟级）+ 长命 refresh token（天级）"：前者泄露的窗口小，后者存在服务端能撤销的地方（例如 HttpOnly Cookie），必要时可以踢人。

## 调试

想直接看 token 内容，用 `jwt.decode(..., options={"verify_signature": False})`，或者贴到 jwt.io。注意**别把真实环境的 token 贴到第三方网站**——能解开就等于把里面的信息交出去了。
