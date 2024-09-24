YAML		:= -f docker-compose.yml
CERT_DIR	:= ./nginx/ssl
KEY_PATH	:= $(CERT_DIR)/server.key
CSR_PATH	:= $(CERT_DIR)/server.csr
CERT_PATH	:= $(CERT_DIR)/server.crt

all: up clean

ui_install:
	cd frontend && bun i

ui_dev:
	cd frontend && bun run dev

ui_build:
	cd frontend && bun run build

$(CERT_DIR):
	mkdir -p $(CERT_DIR)
cert: $(CERT_DIR)
ifeq ("$(wildcard $(KEY_PATH))", "")
	openssl genrsa -out $(KEY_PATH) 2048
	openssl req \
		-new \
		-newkey rsa:2048 \
		-days 365 \
		-nodes \
		-x509 \
		-subj "/C=SG/ST=Singapore/L=RobinsonRoad/O=test-foodpanda/CN=www.test-foodpanda.sg" \
		-keyout $(KEY_PATH) \
		-out $(CERT_PATH)
	# openssl x509 -req -days 365 -in $(CSR_PATH) -signkey $(KEY_PATH) -out $(CERT_PATH)
endif
del_cert:
	rm $(KEY_PATH) $(CSR_PATH) $(CERT_PATH)

up: cert
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
purge: down del_cert
	-docker container ls | awk -F' ' 'NR>1 {print $$1}' | xargs --no-run-if-empty docker stop
	-docker volume ls | awk -F' ' 'NR>1 {print $$2}' | xargs --no-run-if-empty docker volume rm
	-docker image ls | awk -F' ' 'NR>1 {print $$3}' | xargs --no-run-if-empty docker rmi
	-docker volume prune -f
	-docker network prune -f
	-docker image prune -f
	-docker system prune -f
re: down all

.PHONY: all ui_install ui_dev ui_build cert \
		up start stop restart down clean purge re \
		ls log
