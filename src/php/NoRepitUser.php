<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$conex = mysqli_connect($server, $user, $password, $database);

if($conex) {
    // Saneamiento y validación
    $nombre = filter_input(INPUT_GET, 'nombre', FILTER_SANITIZE_STRING);

    // Uso de sentencias preparadas
    $stmt = $conex->prepare("SELECT Id_User, Nomb, keyPublic FROM usuario WHERE Nomb = ?");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $resultado = $stmt->get_result();
    echo json_encode(['Num'=>$resultado->num_rows]);
    
    // Cerrar conexión
    mysqli_close($conex);
    $stmt->close();
} else {
    echo json_encode(['error' => 'La comunicación no fue posible']);
}
?>