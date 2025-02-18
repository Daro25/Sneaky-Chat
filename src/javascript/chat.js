function obtenerDatos(param1, param2) {
    return new Promise((resolve, reject) => {
        let st = '';
        const url = `consultar.php?sala_id=${encodeURIComponent(param1)}&Id_User=${encodeURIComponent(param2)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(fila => {
                    st += `
                        <div class="msj">
                            <div id="box">
                                <h4>${fila.nombre}</h4>
                                <h4 class="data">${fila.data}</h4>
                                <p class="contexto">${fila.contexto}</p>
                            </div>
                        </div>`;
                });
                resolve(st);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}
//-------------------- Creacion de la tabla -------------------
let tabla = document.getElementById('msjes');
//---------------------Visualizar datos------------------------
columna();//ejecutamos la funcion que genera la tabla
function recargar() {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }//este while vacia la tabla para volver a actualizar los datos
    columna();//y actualizamos los datos
}
function columna() {
    // Llamas a obtenerDatos y manejas el resultado cuando esté listo
    obtenerDatos()
        .then(resultado => {
            st += resultado;
            tabla.innerHTML = st;
        })
        .catch(error => {
            // Manejar errores si es necesario
            console.error('Error:', error);
        });
}