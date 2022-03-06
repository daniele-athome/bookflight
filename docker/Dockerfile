ARG ALPINE_VERSION=3.15
FROM ghcr.io/linuxserver/baseimage-alpine-nginx:3.15

RUN apk add --no-cache \
    curl \
    php8 \
    php8-intl \
    php8-bcmath \
    php8-pdo \
    php8-pdo_sqlite \
    php8-simplexml \
    php8-xmlwriter \
    php8-fileinfo \
    php8-zip \
    php8-pecl-apcu \
    php8-mysqli \
    php8-ctype \
    php8-curl \
    php8-dom \
    php8-fpm \
    php8-gd \
    php8-intl \
    php8-json \
    php8-mbstring \
    php8-mysqli \
    php8-opcache \
    php8-openssl \
    php8-phar \
    php8-session \
    php8-xml \
    php8-xmlreader \
    php8-zlib \
    php8-sqlite3 \
    mariadb-client

RUN ln -s /usr/bin/php8 /usr/bin/php

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
