<?php

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
    $resultados = "La conexión a la base de datos falló: " . $conex->connect_error;
} else {
    $id_sala = $_GET['Id_Sala']; 
    $contra_sala = $_GET['Contra_Sala']; 
    $nom_sala = $_GET['Nom_Sala']; 
    $cupo = $_GET['Cupo'];

    $sql = "INSERT INTO sala (Id_sala, Contra_Sala, Nom_Sala, Cupo) VALUES ( '$Id_sala', '$Contra_Sala', '$Nom_Sala', '$Cupo')";

    if ($conex->query($sql) ===TRUE ){
        $resultados = "Registro de sala exitoso.";
    } else {
        $resultados = "Error al insertar la sala.";
    }

    $conex->close();
}

$datos = array('resultado' => $resultados);
$datos_json = json_encode($datos);
echo $datos_json;
?>