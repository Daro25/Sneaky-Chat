<?php 
header("Access-Control-Allow-Origin: *");

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
$conex = mysqli_connect($server, $user, $password, $database);

if($conex) {
    $tablas = $conex->query("SELECT Id_sala, Contra_Sala, Nom_Sala, Cupo 
             FROM salas 
             WHERE Id_sala = " . (int)$_GET["Id"])
             ->fetch_all(MYSQLI_ASSOC);

    mysqli_close($conex);

    $tablasArray = [];
    foreach ($tablas as $li) {
        $id_sala = $li['Id_sala'];
        $contra_sala = $li['Contra_Sala']; 
        $nom_sala = $li['Nom_Sala']; 
        $cupo = $li['Cupo']; 
        $tablasArray[] = new Tabla($id_sala, $contra_sala, $nom_sala, $cupo);
    }

    echo json_encode($tablasArray);
} else {
    echo '[la comunicación no fue posible]';
}
?>