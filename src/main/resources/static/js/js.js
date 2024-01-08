function manejarCambioTipoOperacion() {

    var tipoOperacion = document.querySelector('input[name="tipoOperacion"]:checked').value;


    var radioButtonsBusqueda = document.querySelectorAll('input[name="tipoBusqueda"]');
    var inputsFecha = document.querySelectorAll('.formulario__campo[type="text"]');
 

    //Bloquear elemntos
    radioButtonsBusqueda.forEach(function (radio) {
        radio.disabled =true;
        radio.checked=false;
    });

    inputsFecha.forEach(function (input) {
        input.disabled =true;
        input.disabled=false;
    });



    // Excepciones
    if (tipoOperacion === 'promedioMes') {
      
        document.getElementById("ano").disabled = false;

    } else if (tipoOperacion === 'varacionActual') {
    
        document.getElementById('fecha').disabled = false;
        document.getElementById('ano').disabled = false;
    } else if (tipoOperacion === 'promedioModa') {

       document.getElementById("fechaMes").disabled=false;
       document.getElementById("fechaSelect").disabled=false;
       document.getElementById("ano").disabled = true;

        
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var radioButtonsBusqueda = document.querySelectorAll('input[name="tipoBusqueda"]');
    var selects = document.querySelectorAll('.formulario__campo[type="select"]');
    var fechaSelect = document.getElementById('fechaSelect');
    var fechaMes = document.getElementById('fechaMes');

    // bloquear los combobox
    fechaSelect.disabled = true;
    fechaMes.disabled = true;
    // bloquear los radiobutton
    radioButtonsBusqueda.forEach(function (radio) {
        radio.disabled = true;
    });

    // bloquear los combo prueba2
    selects.forEach(function (select) {
        select.disabled = false;
        
    });


    
    var promedioModaRadioButton = document.getElementById("promedioModa");
    promedioModaRadioButton.addEventListener('change', function () {
        // habilitar los campos verificando el radiobutton id=promedioModa
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
});

function limpiarCampos() {
    document.getElementById("fechaCompleta").value = "";
    document.getElementById("fechaAno").value = "";
    document.getElementById("errores").innerHTML = "";
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

function agregarError(mensaje) {
    document.getElementById("errores").innerHTML += mensaje + "<br>";
}


var resultadosGlobal = [];
var datosApi = [];

async function obtenerUltimoValorReferenciaActual(tipoIndicador) {
    // obtener fecha actual del pc
    var fechaActual = new Date();

    // formatear fecha
    var dd = String(fechaActual.getDate()).padStart(2, '0');
    var mm = String(fechaActual.getMonth() + 1).padStart(2, '0'); 
    var yyyy = fechaActual.getFullYear();

    var fechaActualFormato = dd + '-' + mm + '-' + yyyy;

    
    var apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fechaActualFormato}`;

    try {
        // Consumir api
        var response = await fetch(apiUrl);
        var data = await response.json();

       
        if (data && data.serie && data.serie.length > 0) { // Validacion si api devolvio resultados
            
            data.serie.forEach(item => {
                // Extraer fecha y valor
                var fecha = new Date(item.fecha);
                var valor = item.valor;

                // Guardar datos ordenados
                var resultado = {
                    fecha: fecha,
                    valor: valor
                };

                // Agregar al array los datos 
                datosApi.push(resultado);

            });
            

           
            datosApi.forEach(resultado => {
                var fechaResultado = resultado.fecha;
                var valorResultado = resultado.valor;
               // console.log("Fecha: ", fechaResultado);
               // console.log("Valor: ", valorResultado);
                
            });
            var primerResultado = datosApi[0];
            // console.log("Array info:", primerResultado);
            var valorPrimerResultado = primerResultado.valor;
            // console.log("valorPrimerResultado: ",valorPrimerResultado);
            var ultimoValorReferencia = parseFloat(valorPrimerResultado);
            // console.log("Valor Actual de ",tipoIndicador,": ",ultimoValorReferencia);


            return ultimoValorReferencia;
        } else {
            console.error("La API no deolvio datos.");
            return 0; 
        }
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        return 0; 
    }
    }
    async function obtenerDatosDeAPI(apiUrl) {
        try {
            var response = await fetch(apiUrl);
            var data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener datos de la API:", error);
            throw error;
        }
    }

    //Operacion Matematica !!!!!!REVISAR LOGICA MAS TARDE!!!!!!!!!!!!!!!!
    function calcularDiferenciaYPorcentaje(valorReferenciaActual, valorPrimerResultado) { 
        var diferenciaPesos = valorReferenciaActual - valorPrimerResultado;
        var porcentajeVariacion = ((valorReferenciaActual - valorPrimerResultado) / valorPrimerResultado) * 100;

        console.log("Porcentaje de Variación:", porcentajeVariacion.toFixed(3));
        console.log("Diferencia en Pesos:", diferenciaPesos.toFixed(3));

       
    }
    //Operacion Matematica !!!!!!REVISAR LOGICA MAS TARDE!!!!!!!!!!!!!!!!
 async function realizarOperacionesMatematicas(resultadosGlobal, tipoIndicador) {
        try {
           
            if (resultadosGlobal.length > 0) {
                var primerResultado = resultadosGlobal[0];
                var valorPrimerResultado = primerResultado.valor;
    
               await obtenerUltimoValorReferenciaActual(tipoIndicador).then(valorReferenciaActual => {
                    console.log("Inicio del todo valor referencial actual: ", valorReferenciaActual);
    
                    calcularDiferenciaYPorcentaje(valorReferenciaActual, valorPrimerResultado);
                    resultadosGlobal=[]
                    
                }).catch(error => {
                    console.error("Error al obtener el valor de referencia actual:", error);
                });
            } else {
                console.warn("No existen resultados para la consulta que realizó FUNCION realizarOperacionesMatematicas.");
               
            }
           
        } catch (error) {
            console.error("Error en realizarOperacionesMatematicas:", error);
        }
       
        
    }

    function realizarOperacionesMatematicasAnio(data) {
        var promediosMensuales = {};
        var variacionesMensuales = {};

        data.serie.forEach((item, index) => {
            var fecha = new Date(item.fecha);
            var valor = item.valor;
            var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');

            if (!promediosMensuales[mes]) {
                promediosMensuales[mes] = { suma: 0, count: 0 };
            }

            promediosMensuales[mes].suma += valor;
            promediosMensuales[mes].count++;

            if (index > 0) {
                var variacion = ((valor - data.serie[index - 1].valor) / data.serie[index - 1].valor) * 100;
                variacionesMensuales[mes] = variacion;
            }
        });

        for (var mes in promediosMensuales) {
            if (promediosMensuales.hasOwnProperty(mes)) {
                var promedio = promediosMensuales[mes].suma / promediosMensuales[mes].count;
                var variacion = variacionesMensuales[mes] || 0;

                console.log("Mes: ",mes," Promedio: ", promedio.toFixed(3), " Variacion: ",variacion.toFixed(3));
            }
        }
    }

    async function validarFormulario(event) {
        event.preventDefault();
        document.getElementById("errores").innerHTML = "";
        var tipoIndicador = document.getElementById("tipoIndicador").value;
        var tipoOperacionElement=document.querySelector('input[name="tipoOperacion"]:checked')
        var tipoBusquedaElement = document.querySelector('input[name="tipoBusqueda"]:checked');
     if(tipoOperacionElement!=null){
        var tipoOperacion=tipoOperacionElement.value;
    if(tipoBusquedaElement!=null){  
        
    if(tipoOperacion==="varacionActual" || tipoOperacion==="promedioMes" ){
        if (tipoBusquedaElement) {
            var tipoBusqueda = tipoBusquedaElement.value;
    
            let apiUrl;
        if(tipoOperacion==="varacionActual"){
            if (tipoBusqueda === "fecha") {
                var fechaCompleta = document.getElementById("fechaCompleta").value;
                var regexFechaCompleta = /^\d{2}-\d{2}-\d{4}$/;
    
                if (!regexFechaCompleta.test(fechaCompleta)) {
                    agregarError("Formato de fecha (dd-mm-yyyy) incorrecto.");
                    return false; 
                }
    
                apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fechaCompleta}`;
            } else if (tipoBusqueda === "ano") {
                var fechaAno = document.getElementById("fechaAno").value;
                var regexFechaAno = /^\d{4}$/;
    
                if (!regexFechaAno.test(fechaAno)) {
                    agregarError("Formato de año (yyyy) incorrecto.");
                    return false; 
                }
    
                apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fechaAno}`;
            }
    
            try {
                var data = await obtenerDatosDeAPI(apiUrl);
                console.log("Datos de la API: ", data);
    
                resultadosGlobal = []; 
                //guardar los valores.
                data.serie.forEach(item => {
                    var fecha = new Date(item.fecha);
                    var valor = item.valor;
                    var resultado = {
                        fecha: fecha,
                        valor: valor
                    };
                    resultadosGlobal.push(resultado);
                });
    
                //Operaciones Matematicas
                realizarOperacionesMatematicas(resultadosGlobal, tipoIndicador);
                datosApi=[];
                resultadosGlobal=[];
                limpiarCampos();
            } catch (error) {
                console.error("Error API:", error);
            }
            }else if (tipoOperacion==="promedioMes"){
                var fechaAno = document.getElementById("fechaAno").value;
                var regexFechaAno = /^\d{4}$/;
                if (!regexFechaAno.test(fechaAno)) {
                    agregarError("Formato de año (yyyy) incorrecto.");
                    return false; 
                }
        
                apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fechaAno}`;
        
                try {
                    var data = await obtenerDatosDeAPI(apiUrl);
                    //Operacion matematica
                    realizarOperacionesMatematicasAnio(data);
                } catch (error) {
                    console.error("Error al consumir la API", error);
                }
        
                return false; 
            }
        } else {
            agregarError("Seleccione un tipo de busqueda (Fecha o Año).");
        }
    }else if(tipoOperacion===null){
        agregarError("Seleccione un tipo de operacion (Promedio, Variacion actual o Promedio y Moda entro).");
    }
        return false;
    }else if(tipoOperacion === "promedioModa"){

        
        var anio = document.getElementById("fechaSelect").value;
        var mes = document.getElementById("fechaMes").value;

        try {
           
            var datosApi = await obtenerDatosApiPorRangoFechas(tipoIndicador, anio, mes);
            console.log("Datos de la API:", datosApi);

            //Operaciones Matematicas !!!!!!!!!REVISAR LOGICAAAAA!!!!!!!!!!!!
            calcularDiferenciaYPorcentajeSelect(datosApi);
            calcularPromedioYModa(datosApi);
            datosApi=[];
        } catch (error) {
            console.error("Error al realizar operaciones matemáticas:", error);
        }

        return false;
    }else if (tipoOperacionElement==null){
        agregarError("Seleccione un tipo de operacion (Promedio, Variacion actual o Promedio y Moda QUEDO ACA).");
    }
    }else{
        gregarError("Seleccione un tipo de operacion (Promedio, Variacion actual o Promedio y Moda ARREGLAR ESTE IF MAS TARDE).");
    }
    }
    


function obtenerUltimoDiaMes(anio, mes) {
    return new Date(anio, mes, 0).getDate();
}
function obtenerRangoFechas(anio, mes) {
    var ultimoDia = new Date(anio, mes, 0).getDate();
    return  ultimoDia;
}


//REVISAR LOGICA PROBLEMA EN ENTREGAR DATOS.
async function obtenerDatosApiPorRangoFechas(tipoIndicador, anio, mes) {
    var  ultimoDia  = obtenerRangoFechas(anio, mes);
    var datosApi = [];

    for (let dia = 1; dia <= ultimoDia; dia++) {
        try {
            var fecha = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
            var apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${fecha}`;
            
            var response = await fetch(apiUrl);
            var data = await response.json();
            var valor = data.serie[0].valor; 
            datosApi.push({ fecha, valor });
            console.log("resultado; ", datosApi);
        } catch (error) {
            console.error(`Error al obtener datos de la API para el día ${dia}:`, error);
        }
    }

    return datosApi;
}

// OPERACION MATEMATICA !!!!!!!!!!!!!REVISAR LOGICAAAA!!!!!!!!!!!!
function calcularDiferenciaYPorcentajeSelect(valores) {
    if (valores.length > 0) {
        var primerResultado = valores[0].valor;
        var ultimoResultado = valores[valores.length - 1].valor;
        var diferenciaPesos = ultimoResultado - primerResultado;
        var porcentajeVariacion = ((ultimoResultado - primerResultado) / primerResultado) * 100;

        console.log("Porcentaje de Variacion:", porcentajeVariacion.toFixed(3));
        console.log("Diferencia en Pesos: ", diferenciaPesos.toFixed(3));
        resultadosGlobal=[]
    } else {
        console.warn("No hay resultados para calcular la diferencia y el porcentaje.");
    }
}

// !!!!!!!!!!!!!!!REVISAR LOGICAA!!!!!!!!!
function calcularPromedioYModa(valores) {
    if (valores.length > 0) {
        var suma = valores.reduce((acumulador, valor) => acumulador + valor.valor, 0);
        var promedio = suma / valores.length;

        var conteo = {};
        valores.forEach(resultado => {
            conteo[resultado.valor] = (conteo[resultado.valor] || 0) + 1;
        });

        var moda = Object.keys(conteo).reduce((a, b) => (conteo[a] > conteo[b] ? a : b));

        console.log("Promedio:", promedio.toFixed(3));
        console.log("Moda:", moda);
    } else {
        console.warn("No hay resultados para calcular el promedio y la moda.");
    }
}
async function obtenerDatosApiPorPrimerDiaMes(tipoIndicador, anio, mes) {
    var primerDia = obtenerPrimerDiaMes(anio, mes);
    var apiUrl = `https://165.227.94.139/api/${tipoIndicador}/${primerDia}`;

    try {
        var response = await fetch(apiUrl);
        var data = await response.json();
        return data.serie;
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
        throw error;
    }
}
// Resultados y consulta a la api
async function realizarOperacionesConAnioMes(tipoIndicador, anio, mes) {
    try {
        var datosApi = await obtenerDatosApiPorPrimerDiaMes(tipoIndicador, anio, mes);
        console.log("Datos de la API:", datosApi);
        // OPERACIONES MATEMATICAS
        calcularDiferenciaYPorcentajeSelect(datosApi);
        calcularPromedioYModa(datosApi);
    } catch (error) {
        console.error("Error al realizar operaciones matemáticas:", error);
    }
}
