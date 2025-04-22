<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
//header("Content-Type: application/json");


class Tabla 
{
    public $Id_User, $Nomb, $KeyPublic;
    
    function __construct($Id_User, $Nomb, $KeyPublic)
    {
        $this->Id_User = $Id_User;
        $this->Nomb = $Nomb;
        $this->KeyPublic = $KeyPublic;
    }
}

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$conex = mysqli_connect($server, $user, $password, $database);

if($conex) {
    // Saneamiento y validación
    $id_sala = filter_input(INPUT_GET, 'id_sala', FILTER_SANITIZE_STRING);

    // Uso de sentencias preparadas
    $stmt = $conex->prepare("SELECT Id_User, Nomb, keyPublic FROM usuario WHERE Sala_Id = ?");
    $stmt->bind_param("i", $id_sala);
    $stmt->execute();
    
    // Obtener resultados
    $result = $stmt->get_result();
    $tablasArray = [];
    
    while ($li = $result->fetch_assoc()) {
        $Id_User = $li['Id_User'];
        $Nomb = $li['Nomb']; 
        $keyPublic = $li['keyPublic'];
        $tablasArray[] = new Tabla($Id_User, $Nomb, $keyPublic);
    }

    echo json_encode($tablasArray);
    
    // Cerrar conexión
    mysqli_close($conex);
} else {
    echo json_encode(['error' => 'La comunicación no fue posible']);
}
?>