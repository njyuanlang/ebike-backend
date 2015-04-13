# !/bin/sh

cd $(dirname $0)

rsync -av deploy@42.121.124.27:/exprodata/backup/ebike .

sh restoredata.sh