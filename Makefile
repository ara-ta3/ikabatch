NPM=npm
NODE=node

install:
	$(NPM) install

compile:
	$(NPM) run tsc

run: compile
	$(NODE) src/main.js
