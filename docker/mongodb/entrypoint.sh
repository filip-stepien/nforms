#!/bin/bash
set -e

if [ -z "$MONGO_KEYFILE_CONTENT" ]; then
    echo "MONGO_KEYFILE_CONTENT is not set."
    exit 1
fi

echo "$MONGO_KEYFILE_CONTENT" > /data/keyfile
chmod 400 /data/keyfile
chown mongodb:mongodb /data/keyfile

exec /usr/local/bin/docker-entrypoint.sh --replSet rs0 --keyFile /data/keyfile --bind_ip_all