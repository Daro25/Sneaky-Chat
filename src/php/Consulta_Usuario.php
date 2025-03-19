<?php 
header("Access-Control-Allow-Origin: *");

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
    $tablas = $conex->query("SELECT Id_User, Nomb, keyPublic 
             FROM usuarios 
             WHERE Id_User = " . (int)$_GET["Id_User"])
             ->fetch_all(MYSQLI_ASSOC);

    mysqli_close($conex);

    $tablasArray = [];
    foreach ($tablas as $li) {
        $Id_User = $li['Id_User'];
        $Nomb = $li['Nomb']; 
        $keyPublic = $li['keyPublic'];
        $tablasArray[] = new Tabla($id, $nombre, $keyPublic);
    }

    echo json_encode($tablasArray);
} else {
    echo '[la comunicación no fue posible]';
}
?>