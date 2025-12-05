# Dockerfile
FROM php:8.2-cli

# Instalar cron
RUN apt-get update && apt-get install -y cron default-mysql-client && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install mysqli

# Directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiamos todo el código dentro del contenedor
COPY . /var/www/html

# Copiamos el archivo de crontab custom
COPY docker/crontab /etc/cron.d/centinela-cron

# Asignar permisos correctos y registrar el cron
RUN chmod 0644 /etc/cron.d/centinela-cron \
    && crontab /etc/cron.d/centinela-cron

# Archivo de log de cron
RUN touch /var/log/cron.log

# Script de entrada
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Comando por defecto
CMD ["/entrypoint.sh"]
