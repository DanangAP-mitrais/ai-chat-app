.PHONY: install run-dev run-test setup-db migrate create-migration

# Install dependencies using Poetry
install:
	poetry install

# Run the development server
run-dev:
	poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8001

# Run tests
test:
	poetry run pytest -v

# Setup database (create tables)
setup-db:
	poetry run python -c "from src.core.database import engine, Base; import asyncio; async def create_db(): await Base.metadata.create_all(engine); asyncio.run(create_db())"

# Run database migrations
migrate:
	poetry run alembic upgrade head

# Create a new migration
create-migration:
	poetry run alembic revision --autogenerate -m "New migration"