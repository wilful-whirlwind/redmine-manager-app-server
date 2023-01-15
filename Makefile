all: build

build: front-build back-build

front-build: views
	cd views && npm run build-dev

back-build: main.js
	npm start
