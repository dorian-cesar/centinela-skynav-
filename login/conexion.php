<?php

require_once __DIR__ . '/../env.php';

$con_hostname = getenv('DB_HOST')     ?: 'localhost';
$con_username = getenv('DB_USER')     ?: 'root';
$con_password = getenv('DB_PASSWORD') ?: '';
$con_database = getenv('DB_NAME')     ?: '';

// Conexión MySQLi
$mysqli = new mysqli($con_hostname, $con_username, $con_password, $con_database);

if ($mysqli->connect_errno > 0) {
    die("Error en la conexión: " . $mysqli->connect_error);
}