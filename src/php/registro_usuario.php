<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
//header("Content-Type: application/json");


class Respuesta {
    public $res;
    function __construct($res) {
        $this->res = $res;
    }
}

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';

$conex = mysqli_connect($server, $user, $password, $database);

if ($conex->connect_error) {
    echo json_encode(['resultado' => "La conexión a la base de datos falló: " . $conex->connect_error]);
    exit();
}

$nomb = $_GET['nomb']; 
$contra = $_GET['contra']; 
$sala_id = (int)$_GET['sala_id']; // Asegúrate de convertir a entero
$edad = (int)$_GET['edad']; // Asegúrate de convertir a entero
$key = $_GET['key'];

// Validar los campos
if (empty($nomb) || empty($contra) || empty($key) || !is_int($sala_id) || !is_int($edad)) {
    echo json_encode(['resultado' => "Todos los campos son obligatorios y sala_id y edad deben ser números."]);
    exit();
}

// Preparar la consulta SQL
$stmt = $conex->prepare("INSERT INTO usuario (nomb, contra, sala_id, Edad, keyPublic) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssiss", $nomb, $contra, $sala_id, $edad, $key); // 'ssiss' indica tipos de datos: string, string, integer, integer, string

if ($stmt->execute()) {
    $id = $conex->insert_id;
    echo json_encode(['ID' => $id]);
} else {
    echo json_encode(['resultado' => "Error al insertar el registro: " . $stmt->error]);
}

$stmt->close();
$conex->close();
?>