<?php 

class Tabla 
{
	public $ID, $sala_Id, $FechayHora, $Texto, $User_Id;
	function __construct($ID, $sala_Id, $FechayHora, $Texto, $User_Id)
	{
		$this->ID= $ID;
		$this->sala_Id= $sala_Id;
        $this->FechayHora= $FechayHora;
        $this->Texto = $Texto;
        $this->User_id = $User_Id; //Esta clase define un objeto Tabla con cinco propiedades: ID, sala_Id, FechayHora, Texto, y User_Id.
		// el constructor recibe parametros que son valores que se pasaran al crear un nuevo objeto de la clase
		//asigna el valor del parametro al atributo
	}
}
// mysqli_connect se utiliza
// para conectar al servidor de la base de datos MySQL utilizando las credenciales proporcionadas
$user = 'root';
$server = 'localhost';
$database = 'mensajer_a';
$password = '';
$conex = mysqli_connect($server, $user, $password, $database);
if($conex){ //si la conexion tiene exito...
	//Se verifica si la conexión a 
	// la base de datos fue exitosa. Si no lo fue, el código dentro del bloque else se ejecutará.
    $tablas = $conex->query("SELECT id, sala_Id, dates, Texto, User_Id 
             FROM mensaje 
             WHERE sala_Id = " .(int)$_GET["sala"] . " 
             AND ID >" . (int)$_GET["Id"])
			 ->fetch_all(MYSQLI_ASSOC); //este metodo recupera todas las filas del resultadode la consulta
			 //hace que los datos se devuelvan como array asociativo
	//el metodo query se utliza para ejecutar una consulta sql en la base seleccionando las colum
	// de la tabla cuando 
	mysqli_close($conex);
	//Se cierra la conexión a la base de datos después de obtener los resultados de la consulta.

	$tablasArray = [];//este sera el array que almacenar� cada fila para mostrarlo con el javascript en el otro programa
	foreach ($tablas as $li) {//se accede a cada fila de la consulta
		//se guardar�n cada valor en una variable temporal para pasarlo con parametros en la clase
		$id = $li['id'];
        $t1= $li['sala_Id'];
		$t2 = $li['dates']; 
		$t3 = $li['Texto']; 
        $t4 = $li['User_Id'];
		$tablasArray[] = new Tabla($id, $t1, $t2, $t3, $t4);//se crea un objeto con la clase creada anteriormente
	}
	$datos_json = json_encode($tablasArray);
    echo $datos_json; // Se convierte el arreglo de objetos Tabla a formato JSON utilizando json_encode
	// Finalmente, se envía el JSON para que el JavaScript lo pueda procesar.
} else {
	echo '[la comunicacion no fue posible]';
}//si la conexon no tiene exito, pues no hace nada.
?>