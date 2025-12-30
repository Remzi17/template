FROM wordpress:php8.2-apache

RUN docker-php-ext-install mysqli

RUN echo "short_open_tag=On" > /usr/local/etc/php/conf.d/short_open_tag.ini

RUN rm -rf /var/www/html/wp-content/themes/twenty*
RUN rm -rf /var/www/html/readme.html
RUN rm -rf /var/www/html/license.txt
RUN rm -rf /var/www/html/wp-config-sample.php
 