function manejarCambioTipoOperacion() {
    console.log("Manejando cambio de tipo de operación...");
    var tipoOperacion = document.querySelector('input[name="tipoOperacion"]:checked').value;
    var radioButtonsBusqueda = document.querySelectorAll('input[name="tipoBusqueda"]');
    var inputsFecha = document.querySelectorAll('.formulario__campo[type="text"]');

    try {
        radioButtonsBusqueda.forEach(function (radio) {
            radio.disabled = false;
            radio.checked = false;
        });

        inputsFecha.forEach(function (input) {
            input.disabled = true;
            input.value = "";  // Limpiar el valor y deshabilitar
        });

        if (tipoOperacion === 'promedioMes') {
            document.getElementById("fechaMes").disabled = true;
            document.getElementById("fechaSelect").disabled = true;
            document.getElementById("ano").disabled = false ;
            document.getElementById("fecha").disabled = true;
            // Añade mensajes de depuración para entender el flujo
            console.log("Tipo de operación: Promedio Moda");
            console.log("Habilitando inputs para fechaMes y fechaSelect...");
        } else if (tipoOperacion === 'varacionActual') {
            document.getElementById('fecha').disabled = false;
            document.getElementById('ano').disabled = false;
            document.getElementById("fechaMes").disabled = true;
            document.getElementById("fechaSelect").disabled = true;
            // Añade mensajes de depuración para entender el flujo
            console.log("Tipo de operación: Variación Actual");
            console.log("Habilitando inputs para fecha y año...");
        } else if (tipoOperacion === 'promedioModa') {
            document.getElementById("fechaMes").disabled = false;
            document.getElementById("fechaSelect").disabled = false;
            // Añade mensajes de depuración para entender el flujo
            radioButtonsBusqueda.forEach(function (radio) {
                radio.disabled = true;
                radio.checked = false;
            });
        
            // Limpiar y deshabilitar los inputsFecha
            inputsFecha.forEach(function (input) {
                input.disabled = true;
                input.value = "";
            });
            console.log("Tipo de operación: Promedio Moda");
            console.log("Habilitando inputs para fechaMes y fechaSelect...");
        }
    } catch (error) {
        console.error("Error en el manejo de cambio de tipo de operación:", error);
    }
}

function habilitarFecha() {
    document.getElementById("fechaCompleta").disabled = false;
    document.getElementById("fechaAno").disabled = true;
    limpiarCampos();
}

function habilitarAno() {
    document.getElementById("fechaCompleta").disabled = true;
    document.getElementById("fechaAno").disabled = false;
    limpiarCampos();
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded: Página cargada...");

    var radioButtonsBusqueda = document.querySelectorAll('input[name="tipoBusqueda"]');
    var selects = document.querySelectorAll('.formulario__campo[type="select"]');
    var fechaSelect = document.getElementById('fechaSelect');
    var fechaMes = document.getElementById('fechaMes');

    try {
        fechaSelect.disabled = true;
        fechaMes.disabled = true;

        radioButtonsBusqueda.forEach(function (radio) {
            radio.disabled = true;
        });

        selects.forEach(function (select) {
            select.disabled = false;
        });

        var promedioModaRadioButton = document.getElementById("promedioModa");
        promedioModaRadioButton.addEventListener('change', function () {
            if (this.checked) {
                selects.forEach(function (select) {
                    select.disabled = false;
                });
            }
        });

        var fechaSelect = document.getElementById("fechaSelect");
        var fechaActual = new Date();
        var anioActual = fechaActual.getFullYear();
        var anioInicio = 1977;

        for (var i = anioInicio; i <= anioActual; i++) {
            var nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = i;
            nuevaOpcion.text = i;
            fechaSelect.add(nuevaOpcion);
        }
    } catch (error) {
        console.error("Error en la inicialización de la página:", error);
    }
    document.querySelectorAll('input[name="tipoOperacion"]').forEach(function(radio) {
        radio.addEventListener('change', manejarCambioTipoOperacion);
    });
});


function limpiarCampos() {
    document.getElementById("fechaCompleta").value = "";
    document.getElementById("fechaAno").value = "";
    document.getElementById("errores").innerHTML = "";
}

function agregarError(mensaje) {
    console.error("Error: " + mensaje);
    document.getElementById("errores").innerHTML = mensaje;
}
function validarYEnviarFormulario() {
    if (validarFormulario()) {
        document.getElementById("errores").innerHTML = ""; // Limpiar errores en caso de éxito
        return true; // Permitir que el formulario se envíe
    } else {
        return false; // Evitar que el formulario se envíe en caso de error
    }
}
// ...

function validarFormulario() {
    console.log("Validando formulario...");
    var errores = [];

    // Lógica de validación aquí
    var tipoIndicador = document.getElementById("tipoIndicador").value;
    var tipoOperacionElement = document.querySelector('input[name="tipoOperacion"]:checked');
    
    if (!tipoOperacionElement) {
        errores.push("Seleccione un tipo de operación (Promedio, Variación actual o Promedio y Moda entre).");
    } else {
        var tipoOperacion = tipoOperacionElement.value;

        var tipoBusquedaElement = document.querySelector('input[name="tipoBusqueda"]:checked');

        if (!tipoBusquedaElement && tipoOperacion !== "promedioModa") {
            errores.push("Seleccione un tipo de búsqueda (Fecha o Año).");
        } else if (tipoOperacion === "promedioModa" && !tipoBusquedaElement) {
            // Asume un tipo de búsqueda predeterminado para "promedioModa"
            // Puedes ajustar esto según tus necesidades
            document.getElementById("fecha").checked = true;
        } else {
            var tipoBusqueda = tipoBusquedaElement ? tipoBusquedaElement.value : "fecha";

            if ((tipoOperacion === "varacionActual" || tipoOperacion === "promedioMes") && tipoBusqueda === "fecha") {
                var fechaCompleta = document.getElementById("fechaCompleta").value;
                var regexFechaCompleta = /^\d{2}-\d{2}-\d{4}$/;

                if (!regexFechaCompleta.test(fechaCompleta)) {
                    errores.push("Formato de fecha (dd-mm-yyyy) incorrecto.");
                }
            } else if (tipoOperacion === "varacionActual" && tipoBusqueda === "ano") {
                var fechaAno = document.getElementById("fechaAno").value;
                var regexFechaAno = /^\d{4}$/;

                if (!regexFechaAno.test(fechaAno)) {
                    errores.push("Formato de año (yyyy) incorrecto.");
                }
            }
        }
    }

    // Manejo de errores
    if (errores.length > 0) {
        console.error("Errores de validación:", errores);
        document.getElementById("errores").innerHTML = errores.join("<br>");
        return false; // Evitar el envío del formulario en caso de errores
    }

    // Lógica adicional de validación si es necesario

    // Limpiar errores si la validación es exitosa
    document.getElementById("errores").innerHTML = "";
    return true; // Permitir el envío del formulario
}

// ...
