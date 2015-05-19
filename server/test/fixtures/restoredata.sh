# !/bin/sh

cd $(dirname $0)

# mongo passpro-test --eval 'db.dropDatabase()'
# mongorestore -d passpro-test passpro

mongo ebike --eval 'db.dropDatabase()'
mongorestore -d ebike ebike