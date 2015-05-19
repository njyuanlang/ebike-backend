# !/bin/sh

cd $(dirname $0)

# rsync -av deploy@42.121.124.27:/exprodata/backup/ebike .
mongodump -h 121.40.108.30 -d ebike -o .

sh restoredata.sh