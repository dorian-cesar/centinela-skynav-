<?php
/**
 * Carga variables de entorno desde un archivo .env
 * en el mismo directorio de este archivo.
 *
 * Formato esperado:
 *   CLAVE=valor
 *   OTRACLAVE="valor con espacios"
 *   # líneas que comienzan con # son comentarios
 */

if (!function_exists('loadEnv')) {
    function loadEnv(string $path): void
    {
        if (!file_exists($path)) {
            // Si no existe el archivo .env, no hacemos nada
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $line = trim($line);

            // Ignorar comentarios y líneas vacías
            if ($line === '' || $line[0] === '#') {
                continue;
            }

            // Debe contener un "="
            if (strpos($line, '=') === false) {
                continue;
            }

            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Quitar comillas al inicio/fin si las tiene
            $len = strlen($value);
            if ($len >= 2) {
                $first = $value[0];
                $last  = $value[$len - 1];

                if (
                    ($first === '"' && $last === '"') ||
                    ($first === "'" && $last === "'")
                ) {
                    $value = substr($value, 1, -1);
                }
            }

            // Evitar sobreescribir si ya existe en el entorno
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv("$name=$value");
                $_ENV[$name]    = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Cargamos el .env ubicado en el mismo directorio de este archivo
$envPath = __DIR__ . '/.env';
loadEnv($envPath);
