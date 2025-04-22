<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
//header("Content-Type: application/json");

class Tabla 
{
	public $ID, $sala_Id, $FechayHora, $Texto, $User_id;
	function __construct($ID, $sala_Id, $FechayHora, $Texto, $User_id)
	{
		$this->ID= $ID;
		$this->sala_Id= $sala_Id;
        $this->FechayHora= $FechayHora;
        $this->Texto = $Texto;
        $this->User_id = $User_id; //Esta clase define un objeto Tabla con cinco propiedades: ID, sala_Id, FechayHora, Texto, y User_Id.
		// el constructor recibe parametros que son valores que se pasaran al crear un nuevo objeto de la clase
		//asigna el valor del parametro al atributo
	}
}
// mysqli_connect se utiliza
// para conectar al servidor de la base de datos MySQL utilizando las credenciales proporcionadas
$user = 'droa';
$server = 'localhost';
$database = 'mensajer_a';
$password = 'droaPluving$1';
$conex = mysqli_connect($server, $user, $password, $database);
if (!$conex) {
    die('Conexión fallida: ' . mysqli_connect_error());
}

$stmt = $conex->prepare("SELECT id, sala_Id, dates, Texto, User_Id FROM mensaje WHERE sala_Id = ? AND ID > ?");
$stmt->bind_param("ii", $_GET["sala"], $_GET["Id"]);
$stmt->execute();
$result = $stmt->get_result();

$tablasArray = [];
while ($li = $result->fetch_assoc()) {
    $tablasArray[] = new Tabla($li['id'], $li['sala_Id'], $li['dates'], $li['Texto'], $li['User_Id']);
}

$stmt->close();
mysqli_close($conex);

echo json_encode($tablasArray);
?>
