<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
class Respuesta
{
    public $res;
    function __construct($res)
    {
        $this->res = $res;
    }
}

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$resultados;

$conex = mysqli_connect($server, $user, $password, $database);

if ($conex->connect_error) {
    echo json_encode(['resultado' => "La conexión a la base de datos falló: " . $conex->connect_error]);
    exit();
}

$contra_sala = $_GET['Contra_Sala']; 
$nom_sala = $_GET['Nom_Sala']; 
$cupo = (int)$_GET['Cupo']; // Asegúrate de convertir a entero

// Validar los campos
if (empty($contra_sala) || empty($nom_sala) || !is_int($cupo)) {
    echo json_encode(['resultado' => "Todos los campos son obligatorios y Cupo debe ser un número."]);
    exit();
}

$stmt = $conex->prepare("INSERT INTO sala (Contra_Sala, Nom_Sala, Cupo) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $contra_sala, $nom_sala, $cupo);

if ($stmt->execute()) {
    echo json_encode(['resultado' => "Registro de sala exitoso."]);
} else {
    echo json_encode(['resultado' => "Error al insertar la sala: " . $stmt->error]);
}

$stmt->close();
$conex->close();
?>