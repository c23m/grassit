# 密码哈希速查（pwdlib）

> 已归档（2026-09-24）：对应实现已落地在 `backend/app/security.py`，本笔记不再跟随项目演进，保留备查。

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 实测环境：pwdlib 0.3.1 + argon2-cffi 25.1.0。

## 基本用法

```python
from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()      # 模块级建一次

hashed = password_hasher.hash("明文密码")           # 存这个
ok = password_hasher.verify("明文密码", hashed)     # 校验，返回 bool
```

`recommended()` 默认使用 Argon2id。hasher 内部持有算法与参数配置，重复构造没有意义。

## 存储形态

实测输出形如 `$argon2id$v=19$m=65536,t=3,p=4$<salt>$<digest>`，长度约 97 字符，`VARCHAR(255)` 足够。

算法、参数、盐都编码在字符串里，所以调整参数后旧哈希依然可校验。需要在校验通过后顺手把旧参数重写成新参数时，用 `verify_and_update`。

## 实践要点

- 只存哈希；明文和哈希都不要出现在日志、响应体或异常信息里
- 输入是 Pydantic 的 `SecretStr` 时，取值必须 `.get_secret_value()`，直接 `str(secret)` 只会得到 `**********`
- 校验失败时不要区分"用户不存在"和"密码错误"，避免账号枚举
- 哈希过程本身很慢是设计目标（抗暴力破解），不要在密集循环里调用
