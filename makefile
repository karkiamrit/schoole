start:
	pnpm docker:dev

lint-fix:
	docker exec docker-app-1 pnpm lint:fix && docker exec docker-app-1 pnpm format

format:
	docker exec docker-app-1 pnpm format

docker-build:
	docker compose -f docker-compose.yml build

docker-start:
	docker compose -f docker-compose.yml up

prod-start:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d

prod-build:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up --build

prod-down:
	docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml down