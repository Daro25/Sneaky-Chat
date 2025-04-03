<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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
    $nomb = $_GET['nomb']; 
    $contra = $_GET['contra']; 
    $sala_id = $_GET['sala_id'];
    $edad = $_GET['edad'];
    $key = $_GET['key'];
    //contruir la consulta SQLpara insertar un nuevo registro
    $sql = "INSERT INTO usuario (Id_user, nomb, contra, sala_id, Edad, keyPublic) VALUES (NULL, '$nomb', '$contra', '$sala_id', '$edad', '$key')";
    // ejecutar la consulta

    if ($conex->query($sql)===TRUE) {
        $resultados = "Registro exitoso.";
    } else {
        $resultados = "Error al insertar el registro.";
    }
// Cerrar la conexion
    $conex->close();
}

$datos = array('resultado' => $resultados);
$datos_json = json_encode($datos);
echo $datos_json;
?>