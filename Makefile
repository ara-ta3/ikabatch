NPM=npm
NODE=node
from=2020-08-31
to=2020-09-01

install:
	$(NPM) install

compile:
	$(NPM) run tsc

run: compile
	$(NODE) src/main.js $(from) $(to)

