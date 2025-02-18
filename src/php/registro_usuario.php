<?php
/**
 * athor @25DROA13
 */
class Respuesta
{
	public $res;
	function __construct($res)
	{
		$this->res = $res;
	}
}
    $user = 'root';
    $server = 'localhost';
    $database = 'agenda';
    $password = '';
    $resultados;
    $conex = mysqli_connect($server, $user, $password, $database);    
    if ($conex->connect_error) {
        $resultados ="La conexión a la base de datos falló: " . $conn->connect_error;
    } else {
        $no_lista = $_GET['no_lista']; 
        $nombre = $_GET['nombre']; 
        $curp = $_GET['curp']; 
        $direccion = $_GET['direccion'] ;
        $tel = $_GET['tel'];
        $correo = $_GET['correo']; 
        $red_social = $_GET['red_social'];
        // Construir la consulta SQL para insertar un nuevo registro
        $sql = "INSERT INTO datos(no_lista, nombre, curp, direccion, tel, correo, red_social) VALUES ('$no_lista','$nombre','$curp','$direccion','$tel','$correo','$red_social')";
        // Ejecutar la consulta
        if ($conex->query($sql) === TRUE) {
            $resultados = "Registro exitoso.";
        } else {
            $resultados = "Error al insertar el registro. ";
        }
        // Cerrar la conexión
        $conex->close();
    }
    $datos = array('resultado'=> $resultados);
    $datos_json = json_encode($datos);
    echo $datos_json;
?>