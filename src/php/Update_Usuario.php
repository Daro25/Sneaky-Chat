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
    $pass = filter_input(INPUT_GET, 'pass', FILTER_SANITIZE_STRING);
    $key = $_GET['key'];

    // Uso de sentencias preparadas
    $stmt = $conex->prepare("UPDATE usuario SET keyPublic = ? WHERE Contra = ? AND Nomb = ?");
    $stmt->bind_param("sss", $key,$pass, $nombre);
    $stmt->execute();
    
    // Obtener resultados
    $result = $stmt->get_result();
    echo json_encode(['Num'=>mysqli_affected_rows($conex)]);
    
    // Cerrar conexión
    mysqli_close($conex);
} else {
    echo json_encode(['error' => 'La comunicación no fue posible']);
}
?>