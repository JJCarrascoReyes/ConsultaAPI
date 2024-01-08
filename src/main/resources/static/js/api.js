function obtenerFechaActual() {
    var fechaActual = new Date();

    // Obtener componentes de la fecha
    var dia = agregarCeroDelante(fechaActual.getDate());
    var mes = agregarCeroDelante(fechaActual.getMonth() + 1); // Meses comienzan desde 0
    var anio = fechaActual.getFullYear();

    // Formatear la fecha como dd-mm-yyyy
    var fechaFormateada = dia + "-" + mes + "-" + anio;

    return fechaFormateada;
}
async function obtenerUltimoValorReferenciaActual(tipoIndicador) {
    // Obtenemos la fecha actual del computador
    var fechaActual = new Date();

    // Convertimos la fecha al formato "dd-mm-yyyy"
    var dd = String(fechaActual.getDate()).padStart(2, '0');
    var mm = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque los meses van de 0 a 11
    var yyyy = fechaActual.getFullYear();

    var fechaActualFormato = dd + '-' + mm + '-' + yyyy;

    // Construimos la URL de la API con el tipo de indicador y la fecha actual
    var apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fechaActualFormato}`;

    try {
        // Realizamos la solicitud a la API
        var response = await fetch(apiUrl);
        var data = await response.json();

        // Validamos si la API devolvió datos válidos
        if (data && data.serie && data.serie.length > 0) {
            // Guardamos el último valor de referencia
            data.serie.forEach(item => {
                // Extraer fecha y valor
                var fecha = new Date(item.fecha);
                var valor = item.valor;

                // Guardar en un objeto
                var resultado = {
                    fecha: fecha,
                    valor: valor
                };

                // Almacena el objeto en el array global
                datosApi.push(resultado);

            });
            

            // Mostrar los resultados después de haber terminado de iterar sobre la serie
            datosApi.forEach(resultado => {
                var fechaResultado = resultado.fecha;
                var valorResultado = resultado.valor;

                // Realizar operaciones matemáticas con fechaResultado y valorResultado
            });
            var primerResultado = datosApi[0];
            console.log("Array info:", primerResultado);
            var valorPrimerResultado = primerResultado.valor;
            console.log("valorPrimerResultado: ",valorPrimerResultado);
            var ultimoValorReferencia = parseFloat(valorPrimerResultado);
            console.log("Valor Actual de ",tipoIndicador,": ",ultimoValorReferencia);
            // Añadimos el nuevo valor de referencia al array
         //   valoresDeReferencia.push({ fecha: fechaActualFormato, valor: ultimoValorReferencia });

            return ultimoValorReferencia;
        } else {
            console.error("La API no devolvió datos válidos.");
            return 0; // Devolvemos 0 en caso de datos no válidos
        }
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        return 0; // Devolvemos 0 en caso de error
    }
}