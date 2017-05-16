#!/usr/bin/env bash

HOST=api.baoxu360.com
CONTAINER=backend
VPATH=$(pwd)/conf.d/:/etc/nginx/conf.d
if [[ $1 == 'manufacturer' ]]; then
  HOST=ht.baoxu360.com
  CONTAINER=manufacturer
  VPATH=$(pwd)/../ebike-manufacturer/:/usr/share/nginx/html:ro
elif [[ $1 == 'api' ]]; then
  HOST=bx.minfan.pw
  CONTAINER=api
fi

docker rm -f $CONTAINER
docker run -d \
    --name $CONTAINER\
    -e "VIRTUAL_HOST="$HOST \
    -e "VIRTUAL_NETWORK=nginx-proxy" \
    -e "VIRTUAL_PORT=80" \
    -e "LETSENCRYPT_HOST="$HOST \
    -e "LETSENCRYPT_EMAIL=guanbo2002@gmail.com" \
    --network nginx-proxy \
    -v $VPATH \
    nginx