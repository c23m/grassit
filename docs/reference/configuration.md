# 配置与环境变量速查

> 已归档（2026-09-24）：配置读取已落地在 `backend/app/config.py`（pydantic-settings），本笔记不再跟随项目演进，保留备查。

> 参考笔记（学习用），不是项目规范。示例代码由 AI 生成、未经审阅，以实测与官方文档为准。
> 实测环境：Python 3.12 + python-dotenv。

## 优先级：真实环境变量优先

`load_dotenv()` 默认**不覆盖**已经存在的环境变量。实测：

| 操作                                                                                        | 结果                   |
| ------------------------------------------------------------------------------------------- | ---------------------- |
| 先 `os.environ["GREETING"] = "from-real-env"`，再 `load_dotenv()`（文件里是 `from-dotenv`） | 值仍是 `from-real-env` |
| `load_dotenv(override=True)`                                                                | 变成 `from-dotenv`     |

所以本地开发时 `.env` 生效，部署时由 systemd / Docker / 平台注入的真实变量自然优先——这正是想要的行为，除非刻意让 `.env` 说了算。

## `load_dotenv()` 的查找规则

不传路径时会调用 `find_dotenv()` 向上查找 `.env`，查找起点取决于调用方式：

| 调用方式                          | 起点                                   |
| --------------------------------- | -------------------------------------- |
| 普通脚本、模块导入                | 调用该函数的**文件所在目录**，逐级向上 |
| `python -c`、`python -`、管道执行 | 无法定位文件，退化为**当前工作目录**   |

同一个 `load_dotenv()`，`python app.py` 与在别处 `python -c "import app"` 可能读到不同的 `.env`。

## 稳妥写法：显式路径

```python
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
```

这样与实际的启动目录彻底解耦。同一个仓库里放两份 `.env` 时（一份应用用、一份编排工具用）尤其重要，否则会撞上这种症状：应用需要的变量全为空，而**空值不会报"缺少配置"**，它会带着空值往下跑，最后报出一个看起来无关的错误（例如数据库拒绝连接）。

## 读变量的三种写法

```python
os.environ["KEY"]        # 缺失抛 KeyError
os.getenv("KEY")         # 缺失返回 None
os.getenv("KEY", "默认")  # 缺失取默认值
```

必须项建议用会抛错的那种（或显式校验后抛出），让服务**启动时就失败**，而不是等某个请求进来才暴露。

## 值永远是字符串

环境变量没有类型：`DEBUG=false` 读出来是 `"false"`，而 `bool("false")` 是 **True**（非空字符串恒为真）。

```python
debug = os.getenv("DEBUG", "").lower() in {"1", "true", "yes", "on"}   # 正确
port = int(os.getenv("PORT", "8000"))                                  # 数字自己转，失败会抛 ValueError
```

## `.env` 的定位

| 文件           | 是否入库            | 用途                           |
| -------------- | ------------------- | ------------------------------ |
| `.env.example` | 入库                | 变量名清单与示例值，供他人复制 |
| `.env`         | 不入库（gitignore） | 本地开发的真实值               |

原则是"配置不写死在代码里、机密不进版本库"：生产环境的密钥由部署平台注入，`.env` 只是开发便利。

## 直接 `os.getenv` 还是 `pydantic-settings`

| 维度       | `os.getenv`      | `pydantic-settings` 的 `BaseSettings` |
| ---------- | ---------------- | ------------------------------------- |
| 依赖       | 标准库           | 需额外安装 `pydantic-settings`        |
| 类型与校验 | 自己转、自己校验 | 声明类型即校验，缺必填项直接报错      |
| 集中程度   | 散落在各处       | 一个 Settings 类集中声明              |
| 适合       | 变量少、结构简单 | 变量成组、需要类型与默认值管理        |

变量少时前者够用；一旦出现"同一批配置在多处读、还要各自转类型"的情况，换成 `BaseSettings` 更省心。

用 `BaseSettings` 时有个容易忽略的点：它默认对**环境里存在、但 Settings 里没有声明**的变量报 `extra_forbidden`。开发机上通常有一堆无关变量（数据库客户端、CI、编辑器注入的），所以一般要显式写 `extra="ignore"`。实测：

```python
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=..., extra="ignore")
    db_host: str
    ...
```

另外必填项的校验发生在**实例化时**——`Settings()` 少一个 `jwt_secret` 就会抛 `ValidationError`，这正是"启动即失败"想要的效果。

## 密钥类配置

```python
import secrets

secrets.token_urlsafe(32)     # 实测生成 43 个字符
```

要点：用 `secrets` 而不是 `random`（后者不是密码学安全的）；一条密钥只服务一个用途，不复用；不进版本库；长度至少 32 字节；轮换密钥意味着此前签发、尚未过期的凭证全部失效。
