FROM mongo

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
COPY healthcheck.js /scripts/healthcheck.js

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]