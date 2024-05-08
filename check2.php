<?php

// Obtener la nueva colección de JSON
$nuevaColeccionJSON = '[{"patente":"PYLC82","imei":"860896051791382","latitud":-23.5479816,"longitud":-70.3903233,"altitud":68,"evento":42,"velocidad":0,"heading":178,"fechaHora":"07/05/2024 15:39:45","ignicion":0},{"patente":"PYLC63","imei":"860896051791267","latitud":-23.5062633,"longitud":-70.4058633,"altitud":90,"evento":42,"velocidad":76,"heading":333,"fechaHora":"07/05/2024 15:52:06","ignicion":0},{"patente":"KXTD80","imei":"860896051854263","latitud":-23.54774,"longitud":-70.3912099,"altitud":60,"evento":42,"velocidad":0,"heading":249,"fechaHora":"07/05/2024 15:52:10","ignicion":0}]';

// Obtener la versión anterior de la colección desde un archivo o una base de datos
$versionAnteriorJSON = '[{"patente":"PYLC82","imei":"860896051791382","latitud":-23.5479816,"longitud":-70.3903233,"altitud":68,"evento":42,"velocidad":0,"heading":178,"fechaHora":"07/05/2024 15:49:45","ignicion":0},{"patente":"PYLC63","imei":"860896051791267","latitud":-23.5062633,"longitud":-70.4058633,"altitud":90,"evento":42,"velocidad":76,"heading":333,"fechaHora":"07/05/2024 15:52:06","ignicion":0},{"patente":"KXTD80","imei":"860896051854263","latitud":-23.54774,"longitud":-70.3912099,"altitud":60,"evento":42,"velocidad":0,"heading":249,"fechaHora":"07/05/2024 15:52:10","ignicion":0}]';

// Decodificar las colecciones JSON a arrays asociativos

$nuevaColeccion = json_decode($nuevaColeccionJSON, true);
$versionAnterior = json_decode($versionAnteriorJSON, true);

// Identificar elementos actualizados
$elementosActualizados = [];
foreach ($nuevaColeccion as $indice => $elemento) {
    // Comparar cada elemento con su correspondiente en la versión anterior
    if (!isset($versionAnterior[$indice]) || $elemento['fechaHora'] !== $versionAnterior[$indice]['fechaHora']) {
        // Si la fecha y hora son diferentes, se considera que el elemento se ha actualizado
        $elementosActualizados[] = $elemento;
    }
}

// Realizar acciones con los elementos actualizados
if (!empty($elementosActualizados)) {
    // Ejecutar alguna acción con los elementos actualizados, como guardarlos en una nueva colección
    // o imprimirlos en pantalla
    echo "Los siguientes elementos se han actualizado:\n";
    foreach ($elementosActualizados as $elemento) {
        echo json_encode($elemento) . "\n";
    }
} else {
    echo "No se han encontrado elementos actualizados.\n";
}
