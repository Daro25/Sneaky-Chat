<?php

$conexion = mysqli_connect("localhost", "droa", "droaPluving$1", "mensajer_a");

if (!$conexion) {
    echo json_encode(['error' => 'No se ha podido conectar a la Base de Datos: ' . mysqli_connect_error()]);
    exit;
}

$resultado = $conexion->query('SELECT * FROM mensaje');

if ($resultado) {
    $mensaje = $resultado->fetch_all(MYSQLI_ASSOC);
    echo json_encode($mensaje); 
} else {
    echo json_encode([]); 
}

mysqli_close($conexion);
?>