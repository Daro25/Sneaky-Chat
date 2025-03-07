<?php
echo `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 Not Found</title>
</head>
<body>
<script>
    function showError() {
        alert("Error: No hay conexión a Internet. Verifica tu red e inténtalo de nuevo.");
        setTimeout(showError, 3000); // Se repite cada 3 segundos
    }
    window.onload = showError;
</script>
</body>
</html>
    `;
?>