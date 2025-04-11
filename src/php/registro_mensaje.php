<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
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
    echo json_encode(['resultado' => "La conexión a la base de datos falló: " . $conex->connect_error]);
    exit();
}

$sala_Id = $_GET['sala_Id'];
$User_Id = $_GET['User_Id'];
$Texto = $_GET['Texto'];
$dates = date('Y-m-d H:i:s');

$stmt = $conex->prepare("INSERT INTO mensaje (sala_Id, dates, Texto, User_Id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $sala_Id, $dates, $Texto, $User_Id);

if ($stmt->execute()) {
    echo json_encode(['resultado' => "Mensaje registrado exitosamente."]);
} else {
    echo json_encode(['resultado' => "Error al registrar el mensaje: " . mysqli_error($conex)]);
}

$stmt->close();
$conex->close();
?>
