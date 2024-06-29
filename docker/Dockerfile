ARG ALPINE_VERSION=3.19
FROM ghcr.io/linuxserver/baseimage-alpine-nginx:${ALPINE_VERSION}

RUN apk add --no-cache \
    curl \
    php83 \
    php83-intl \
    php83-bcmath \
    php83-pdo \
    php83-pdo_sqlite \
    php83-simplexml \
    php83-xmlwriter \
    php83-fileinfo \
    php83-zip \
    php83-pecl-apcu \
    php83-mysqli \
    php83-ctype \
    php83-curl \
    php83-dom \
    php83-fpm \
    php83-gd \
    php83-intl \
    php83-json \
    php83-mbstring \
    php83-mysqli \
    php83-opcache \
    php83-openssl \
    php83-phar \
    php83-session \
    php83-xml \
    php83-xmlreader \
    php83-zlib \
    php83-sqlite3 \
    mariadb-client

RUN ln -sf /usr/bin/php83 /usr/bin/php

# Bring in gettext so we can get `envsubst`, then throw
# the rest away. To do this, we need to install `gettext`
# then move `envsubst` out of the way so `gettext` can
# be deleted completely, then move `envsubst` back.
RUN apk add --no-cache --virtual .gettext gettext \
    && mv /usr/bin/envsubst /tmp/ \
    \
    && runDeps="$( \
        scanelf --needed --nobanner /tmp/envsubst \
            | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
            | sort -u \
            | xargs -r apk info --installed \
            | sort -u \
    )" \
    && apk add --no-cache $runDeps \
    && apk del .gettext \
    && mv /tmp/envsubst /usr/local/bin/

# Install composer
RUN php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

# copying the source directory and install the dependencies with composer
# TODO selective copy
COPY server/ /app
COPY docker/config.php /app/config.php.in
COPY docker/root/ /

WORKDIR /app

RUN composer install --no-dev --optimize-autoloader --classmap-authoritative --no-interaction --no-progress

VOLUME ["/app/data"]
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1/fpm-ping
