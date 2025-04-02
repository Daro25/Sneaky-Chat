<?php
header("Access-Control-Allow-Origin: *");
class Respuesta
{
    public $res; //Respuesta es una definición de un objeto que tiene una propiedad $res
    function __construct($res)
    {
        $this->res = $res; //inicializa la propiedad $res con el valor pasado cuando se crea un 
        // nuevo objeto de esta clase.
    }
}

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$resultados;

$conex = mysqli_connect($server, $user, $password, $database);
//mysqli_connect es una función que se usa para conectarse a la base de datos usando las credenciales
if ($conex->connect_error) {
    $resultados = "La conexión a la base de datos falló: " . $conex->connect_error;
    //verifica si hay un error en la conexión y guarda un mensaje de error en la variable $resultados
} else {
    $sala_Id = $_GET['sala_Id'];
    $User_Id = $_GET['User_Id'];
    $Texto = $_GET['Texto'];
    $dates = date('Y-m-d-H:i:s'); 

    $sql = "INSERT INTO mensaje(id, sala_Id, dates, Texto, User_Id) VALUE ('null', '$sala_Id', '$dates',' $Texto', '$User_Id')";


    if ($conex->query($sql)) {
        $resultados = "Mensaje registrado exitosamente.";
    } else {
        $resultados = "Error al registrar el mensaje.";
    }

    $conex->close();
}

$datos = array('resultado' => $resultados);
$datos_json = json_encode($datos);
echo $datos_json;
?>