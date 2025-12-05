#!/bin/sh

# Opcional: ejecutar el script principal una vez al iniciar el contenedor
echo "[entrypoint] Ejecutando lpf-centinela.php una vez al inicio..."
/usr/local/bin/php /var/www/html/lpf-centinela.php || true

echo "[entrypoint] Iniciando cron..."
# Iniciar cron en segundo plano
cron

echo "[entrypoint] Mostrando log de cron..."
# Mantener el contenedor vivo viendo el log
tail -f /var/log/cron.log
