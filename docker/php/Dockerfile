FROM wordpress:php8.2-apache

RUN docker-php-ext-install mysqli

RUN echo "short_open_tag=On" > /usr/local/etc/php/conf.d/short_open_tag.ini
