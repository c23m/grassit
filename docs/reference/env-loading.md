# python-dotenv 的查找规则

> 参考笔记（学习用），不是项目规范。以实测与官方文档为准。

## 规则

`load_dotenv()` 不传路径时会调用 `find_dotenv()` 向上查找 `.env`，查找起点取决于调用方式：

| 调用方式                          | 起点                                   |
| --------------------------------- | -------------------------------------- |
| 普通脚本、模块导入                | 调用该函数的**文件所在目录**，逐级向上 |
| `python -c`、`python -`、管道执行 | 无法定位文件，退化为**当前工作目录**   |

所以同一个 `load_dotenv()`，`python app.py` 与在别处 `python -c "import app"` 可能读到不同的 `.env`。

## 一个实测场景

同一个仓库里放两份 `.env`：一份给应用用（`app/database.py` 里 `load_dotenv()` 读），一份给 Docker Compose 用（放在仓库根目录，只有数据库初始化变量）。表现是：

- 进应用目录后再启动（`uvicorn app.main:app`）→ 按调用文件位置向上找到应用那份 `.env`，正常
- 在仓库根目录用 `--app-dir` 启动 → 仍然按文件位置查找，正常
- 在仓库根目录用 `python -c` 导入应用模块 → 退化为当前目录，读到根目录那份 `.env`，应用需要的变量全为空，最终报 `Access denied for user '<系统用户名>'`

变量名对不上时不会报"缺少配置"，而是以空值去连接，于是错误信息看起来像权限问题——这是这类问题最难排查的地方。

## 稳妥写法

把路径写死，与启动目录彻底解耦：

```python
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")
```

`override=True` 可以让 `.env` 覆盖已存在的环境变量（默认不覆盖）。部署时通常希望真实环境变量优先，因此默认行为更合适。
