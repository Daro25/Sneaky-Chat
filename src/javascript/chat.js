var id = 1;                                                                                                                                                      
function obtenerDatos(param1) {
    return new Promise((resolve, reject) => {
        let st = '';
        const url = `./Consultar.php?sala_id=${encodeURIComponent(param1)}&Id=${encodeURIComponent(id)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(fila => {
                    st += `
                        <div class="msj">
                            <div id="box">
                                <h4>${fila.User}</h4>
                                <h4 class="data">${fila.FechayHora}</h4>
                                <p class="contexto">${fila.Texto}</p>
                            </div>
                        </div>`;
                        id = fila.Id;
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
setInterval(() => {
    columna();
}, 1000);//ejecutamos la funcion que genera la tabla
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
            tabla.innerHTML += st;
        })
        .catch(error => {
            // Manejar errores si es necesario
            console.error('Error:', error);
        });
}