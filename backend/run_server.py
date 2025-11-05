import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from src.main import app
from uvicorn import Config, Server


async def run_server():
    config = Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = Server(config)
    await server.serve()


if __name__ == "__main__":
    print("Starting server...")
    try:
        asyncio.run(run_server())
    except KeyboardInterrupt:
        print("Server stopped")
    except Exception as e:
        print(f"Error running server: {e}")
        import traceback
        traceback.print_exc()