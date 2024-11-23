start:
	pnpm install
	pnpm run dev


lint-fix:
	pnpm lint:fix
	pnpm format


format:
	pnpm format

docker-build:
	docker compose -f docker-compose.yml build

docker-start:
	docker compose -f docker-compose.yml up
