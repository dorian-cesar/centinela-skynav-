<?php

// Función para llamar a la API
function llamarAPI() {
    // Tu lógica para llamar a la API
    $url = 'http://tu_api.com/api_traer_datos.php';
    $datos = file_get_contents($url);
    return json_decode($datos, true);
}

// Función para comparar los datos y detectar cambios
function detectarCambios($datosAnteriores, $datosNuevos) {
    $datosActualizados = [];

    foreach ($datosNuevos as $nuevo) {
        $patente = $nuevo['patente'];
        if (!isset($datosAnteriores[$patente]) || $datosAnteriores[$patente] != $nuevo) {
            $datosActualizados[$patente] = $nuevo;
        }
    }

    return $datosActualizados;
}

// Datos anteriores, inicialmente vacíos
$datosAnteriores = [];

while (true) {
    // Llamar a la API y obtener los datos nuevos
    $datosNuevos = llamarAPI();

    // Detectar cambios
    $datosActualizados = detectarCambios($datosAnteriores, $datosNuevos);

    // Mostrar los datos actualizados
    if (!empty($datosActualizados)) {
        echo "Datos actualizados:\n";
        foreach ($datosActualizados as $patente => $datos) {
            echo "Patente: $patente\n";
            echo "Datos: " . json_encode($datos) . "\n";
        }
    } else {
        echo "No hay datos actualizados.\n";
    }

    // Actualizar los datos anteriores
    $datosAnteriores = $datosNuevos;

    // Esperar 40 segundos
    sleep(40);
}
?>
