import argparse
import asyncio

import app.models  # noqa: F401
from app.database import Base, engine

# 建表与 `--reset` 都不带种子数据，重置后要手动把管理员账号补回来（用 POST /auth/register 建就行）：
#   username=admin、昵称 管理员、密码 123456、邮箱 admin@grassit.cn
# 目前只有这个账号算管理员（权限判断还没做）；其余账号一律当测试数据，密码同样用 123456。
# 开发库现有账号见 HANDOVER。


async def init(drop: bool):
    async with engine.begin() as conn:
        if drop:
            await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="drop all tables first")
    args = parser.parse_args()
    asyncio.run(init(args.reset))
