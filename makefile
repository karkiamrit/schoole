start:
	yarn install
	yarn run dev


lint-fix:
	yarn lint:fix
	yarn format


format:
	yarn format

docker-build:
	docker compose -f docker-compose.yml build

docker-start:
	docker compose -f docker-compose.yml up
