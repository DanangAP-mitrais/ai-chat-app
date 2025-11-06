import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.core.database import engine, Base
# Import models to ensure they are registered with Base.metadata
from src.models import user
import asyncio


async def create_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('Database tables created successfully')


if __name__ == "__main__":
    asyncio.run(create_db())