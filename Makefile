YAML			:= -f docker-compose.yml

all: up clean

ui_install:
	cd frontend && bun i

ui_dev:
	cd frontend && bun run dev

ui_build:
	cd frontend && bun run build

up:
	docker compose $(YAML) up -d --build
start:
	docker compose $(YAML) start
ls:
	docker image ls
	docker container ls
	docker volume ls
	docker network ls
	docker compose $(YAML) ls
	docker compose $(YAML) ps
	docker ps
log:
	docker compose $(YAML) logs --tail 50 --follow --timestamps
stop:
	docker-compose $(YAML) stop
restart:
	docker-compose $(YAML) restart
down: stop
	docker-compose $(YAML) down -v
clean:
	-docker image ls | grep '<none>' | awk -F' ' '{print $$3}' | xargs --no-run-if-empty docker rmi --force
purge:
	-docker container ls | awk -F' ' 'NR>1 {print $$1}' | xargs --no-run-if-empty docker stop
	-docker volume ls | awk -F' ' 'NR>1 {print $$2}' | xargs --no-run-if-empty docker volume rm
	-docker image ls | awk -F' ' 'NR>1 {print $$3}' | xargs --no-run-if-empty docker rmi
	-docker volume prune -f
	-docker network prune -f
	-docker image prune -f
	-docker system prune -f
re: down all

.PHONY: all ui_install ui_dev ui_build \
		up start stop restart down clean purge re \
		ls log
