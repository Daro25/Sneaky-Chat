<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
//header("Content-Type: application/json");


class Tabla 
{
    public $ID_Sala, $Contra_Sala, $Nom_Sala, $Cupo;
    
    function __construct($ID_Sala, $Contra_Sala, $Nom_Sala, $Cupo)
    {
        $this->ID_Sala = $ID_Sala;
        $this->Contra_Sala = $Contra_Sala;
        $this->Nom_Sala = $Nom_Sala;
        $this->Cupo = $Cupo;
    }
}

$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$conex = new mysqli($server, $user, $password, $database);

if ($conex->connect_error) {
    die('[la comunicación no fue posible]');
}

if (isset($_GET["nombre"]) && isset($_GET["pass"])) {
    // Prepara la declaración
    $stmt = $conex->prepare("SELECT Id_sala, Contra_Sala, Nom_Sala, Cupo FROM sala WHERE Nom_Sala = ? AND Contra_Sala = ?");
    
    // Asocia los parámetros
    $stmt->bind_param("ss", $_GET["nombre"], $_GET["pass"]);
    
    // Ejecuta la declaración
    $stmt->execute();
    
    // Obtiene el resultado
    $result = $stmt->get_result();
    
    // Cierra la declaración
    $stmt->close();
    
    // Cierra la conexión
    mysqli_close($conex);
    
    // Procesa los resultados
    $tablasArray = [];
    while ($li = $result->fetch_assoc()) {
        $tablasArray[] = new Tabla($li['Id_sala'], $li['Contra_Sala'], $li['Nom_Sala'], $li['Cupo']);
    }

    echo json_encode($tablasArray);
} else {
    echo '[Parámetros faltantes]';
}
?>

