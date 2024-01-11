package PruebaTecnica.ConsultaAPI.controladores;

import PruebaTecnica.ConsultaAPI.modelo.ConsultaApiData;
import PruebaTecnica.ConsultaAPI.modelo.ResultadoApi;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AppControlador {

    @GetMapping("/mostrar-index")
    public String mostrarIndex() {
        return "index";
    }

    @GetMapping("/consultar-api")
    public String consultarApi(
            @RequestParam(name = "tipoIndicador") String tipoIndicador,
            @RequestParam(name = "tipoOperacion") String tipoOperacion,
            @RequestParam(name = "tipoBusqueda", required = false) String tipoBusqueda,
            @RequestParam(name = "fechaCompleta", required = false) String fechaCompleta,
            @RequestParam(name = "fechaAno", required = false) String fechaAno,
            @RequestParam(name = "fechaSelect", required = false) String fechaSelect,
            @RequestParam(name = "fechaMes", required = false) String fechaMes,
            Model model) {
        System.out.println("ENTRO ACAAAAAAAAAAAAA");
        String fecha = (fechaCompleta != null && !fechaCompleta.isEmpty()) ? fechaCompleta : fechaAno;
        // System.out.println("tipoIndicador: " + tipoIndicador);
        // System.out.println("tipoOperacion: " + tipoOperacion);
        // System.out.println("tipoBusqueda: " + tipoBusqueda);
        // System.out.println("fechaCompleta: " + fechaCompleta);
        // System.out.println("fechaAno: " + fechaAno);
        // System.out.println(fecha);
        try {
           // List<ResultadoApi> resultados = ConsultaApiData.realizarConsultaApi(tipoIndicador, fecha);
    
          //  System.out.println("Resultados obtenidos de la API:");
         //   resultados.forEach(System.out::println);
    
   
           // model.addAttribute("resultados", resultados);
    
            if ("varacionActual".equals(tipoOperacion)) {
                System.out.println("Entra a variacionActual");
                List<ResultadoApi> resultadosFechaSeleccionada = ConsultaApiData.realizarConsultaApi(tipoIndicador, fecha);
    
                // Verificar si hay resultados y obtener el primer valor (índice 0)
                if (!resultadosFechaSeleccionada.isEmpty()) {
                    double valorFechaSeleccionada = resultadosFechaSeleccionada.get(0).getValor();
    
                    // Consultar API con la fecha actual del sistema
                    LocalDate fechaActual = LocalDate.now();
                    String fechaActualStr = fechaActual.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    List<ResultadoApi> resultadosFechaActual = ConsultaApiData.realizarConsultaApi(tipoIndicador, fechaActualStr);
    
                    // Verificar si hay resultados y obtener el primer valor (índice 0)
                    if (!resultadosFechaActual.isEmpty()) {
                        double valorFechaActual = resultadosFechaActual.get(0).getValor();
    
                        
    
                        double variacion = ((valorFechaActual - valorFechaSeleccionada) / valorFechaSeleccionada) * 100;
                        variacion = new BigDecimal(variacion).setScale(3, RoundingMode.DOWN).doubleValue();
                        
                        // Realizar la diferencia 
                        double diferencia = valorFechaActual - valorFechaSeleccionada;
                        diferencia = new BigDecimal(diferencia).setScale(3, RoundingMode.DOWN).doubleValue();
    
                        
                        model.addAttribute("variacionActual", variacion);
                        model.addAttribute("diferencia", diferencia);
                        System.out.println("Variación Actual 2024: " + variacion);
                        System.out.println("Diferencia en pesos: " + diferencia);
                    }
                }
            } else if ("promedioMes".equals(tipoOperacion)) {

                System.out.println("Entro en promedioMes");
                try {
                    
                    List<ResultadoApi> resultadosVar = ConsultaApiData.realizarConsultaApi(tipoIndicador, fecha);
                    ConsultaApiData.realizarOperacionesMatematicasAnio(resultadosVar);
                    model.addAttribute("resultados", resultadosVar);

            
                } catch (IOException e) {
                    
                    e.printStackTrace();
                    model.addAttribute("error", "Error al procesar la solicitud. Por favor, intentelo de nuevo.");
                    return "error";
                } catch (Exception e) {

                    e.printStackTrace();
                    model.addAttribute("error", "Error interno del servidor. Por favor, intentelo de nuevo.");
                    return "error";
                }

                    
            } else if ("promedioModa".equals(tipoOperacion)) {
                System.out.println("Entro al promedioModa");
                try {
                    String fechaAnoMes = fechaSelect + "-" + fechaMes;
                    List<ResultadoApi> resultadosVar = ConsultaApiData.realizarConsultaApiParaCadaDia(tipoIndicador, fechaAnoMes);
                  
                    
  
                    ConsultaApiData.realizarOperacionesMatematicasMes(resultadosVar);
                    
                 
            
                    model.addAttribute("resultados", resultadosVar);
                    model.addAttribute("tipoIndicador", tipoIndicador);
                    model.addAttribute("anioSelect", fechaSelect);
                    
                } catch (IOException e) {
                    
                        e.printStackTrace();

                        System.out.println("Respuesta de la API: " + e.getMessage());

                        model.addAttribute("error", "Error al procesar la solicitud. Por favor, intentelo de nuevo.");
                        return "error";
                } catch (Exception e) {
                       
                        e.printStackTrace();

                        
                        System.out.println("Respuesta de la API: " + e.getMessage());

                        model.addAttribute("error", "Error al procesar la solicitud. Por favor, intentelo de nuevo.");
                        return "error";
                }
            }
          //  resultados.forEach(System.out::println);

            return "index";
    
        } catch (IOException e) {
        
            e.printStackTrace();
            model.addAttribute("error", "Error al procesar la solicitud. Por favor, intentelo de nuevo.");
            return "error";
        } catch (Exception e) {
            
            e.printStackTrace();
            model.addAttribute("error", "Error interno del servidor. Por favor, intentelo de nuevo.");
            return "error";
        }
    }
    
    @ExceptionHandler(Exception.class)
    public String handleException(Exception e, Model model) {
        e.printStackTrace(); 
        model.addAttribute("error", "Error al procesar la solicitud. Por favor, intentelo de nuevo asdasd.");
        return "error";
    }
    
public static double calcularVariacionMensual(ResultadoApi resultadoAnterior, ResultadoApi nuevoResultado) {
    double valorAnterior = resultadoAnterior.getValor();

    // Calcular la variacion mensual
    if (valorAnterior != 0) {
        double variacion = ((nuevoResultado.getValor() - valorAnterior) / valorAnterior) * 100;

        
       
        return variacion;
    }

    // Si no hay valor anterior o el valor anterior es cero, retornar 0.0
    return 0.0;
}
    

        public static void realizarOperacionesMatematicasAnio(List<ResultadoApi> data) {
            Map<String, List<ResultadoApi>> resultadosPorMes = agruparPorMes(data);

            resultadosPorMes.forEach((mes, resultadosMensuales) -> {
                // Calcular el promedio del mes
                double promedioMes = calcularPromedio(resultadosMensuales);

                // Calcular la variaacion del mes
                double variacionMes = calcularVariacionMensual(resultadosMensuales);

                
                System.out.println("Mes: " + mes + " Promedio: " + promedioMes + " Variación: " + variacionMes);
            });
        }

        public static double calcularPromedio(List<ResultadoApi> resultados) {
            double suma = resultados.stream().mapToDouble(ResultadoApi::getValor).sum();
            int count = resultados.size();
            return count > 0 ? suma / count : 0.0;
        }
        private static Map<String, List<ResultadoApi>> agruparPorMes(List<ResultadoApi> data) {
            Map<String, List<ResultadoApi>> resultadosPorMes = new HashMap<>();
        
            for (ResultadoApi resultado : data) {
                String mes = resultado.getFecha().substring(0, 7);  
                resultadosPorMes.computeIfAbsent(mes, k -> new ArrayList<>()).add(resultado);
            }
        
            return resultadosPorMes;
        }

        private static double calcularVariacionMensual(List<ResultadoApi> resultadosMensuales) {
            for (int i = 1; i < resultadosMensuales.size(); i++) {
                // ResultadoApi resultadoAnterior = resultadosMensuales.get(i - 1);
                ResultadoApi resultadoActual = resultadosMensuales.get(i);

                double promedioAcumuladoAnterior = resultadosMensuales.subList(0, i)
                        .stream()
                        .mapToDouble(ResultadoApi::getPromedio)
                        .average()
                        .orElse(0.0);

                double variacion = calcularVariacion(promedioAcumuladoAnterior, resultadoActual.getPromedio());
                resultadoActual.setVariacion(variacion);
                
            }
            return 0;
        }




        public static double calcularPromedioMensual(List<ResultadoApi> resultados, String mes) {
            double suma = 0;
            int count = 0;

            // Iterar sobre los resultados del mes
            for (ResultadoApi resultado : resultados) {
                String mesResultado = resultado.getFecha().substring(0, 7);

                if (mesResultado.equals(mes)) {
                    suma += resultado.getValor();
                    count++;
                }
            }

            // Calcular el promedio del mes
            return (count > 0) ? suma / count : 0.0;
        }


        private static double calcularVariacion(double valorAnterior, double valorActual) {
            if (valorAnterior != 0) {
                double variacion = ((valorActual - valorAnterior) / valorAnterior) * 100;
                return variacion;
            }
            return 0.0;
        }
       
}

