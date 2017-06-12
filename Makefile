all:
	node test/fixtures/batchUsers.js test/fixtures/users.csv
	
test:
	npm test