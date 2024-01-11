package PruebaTecnica.ConsultaAPI.modelo;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.net.ssl.HttpsURLConnection;

public class ConsultaApiData {

    public static List<ResultadoApi> realizarConsultaApi(String tipoIndicador, String fecha) throws IOException {
        String apiUrl = construirUrlApi(tipoIndicador, fecha);
        String apiResponse = realizarPeticionApi(apiUrl);
        return mapearRespuesta(apiResponse);
    }

    private static String construirUrlApi(String tipoIndicador, String fecha) {
        return "https://165.227.94.139/api/"+tipoIndicador+"/"+fecha;
    }
private static String realizarPeticionApi(String apiUrl) throws IOException {
    URL url = new URL(apiUrl);
    
    // Desactivar la verificación SSL (No recomendado para producción)
    HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
    connection.setHostnameVerifier((hostname, session) -> true);

    connection.setRequestMethod("GET");

    int responseCode = connection.getResponseCode();
    if (responseCode == HttpURLConnection.HTTP_OK) {
         BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            return content.toString();
    } else {

            BufferedReader errorReader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            StringBuilder errorContent = new StringBuilder();
            String errorInputLine;
            while ((errorInputLine = errorReader.readLine()) != null) {
                errorContent.append(errorInputLine);
            }
            errorReader.close();
            

            System.err.println("Error en la solicitud a la API. Código de respuesta: " + responseCode + ", Mensaje: " + errorContent.toString());
    

            throw new IOException("Error en la solicitud a la API. Código de respuesta: " + responseCode + ", Mensaje: " + errorContent.toString());
    }
}


    private static List<ResultadoApi> mapearRespuesta(String apiResponse) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(apiResponse).get("serie");

        Iterator<JsonNode> elements = jsonNode.elements();
        List<ResultadoApi> resultados = new ArrayList<>();

        while (elements.hasNext()) {
            JsonNode element = elements.next();
            String fecha = element.get("fecha").asText();
            double valor = element.get("valor").asDouble();
            ResultadoApi resultado = new ResultadoApi(fecha, valor);
            resultados.add(resultado);
        }

        return resultados;
    }
    // ConsultaApiData.java
    public static double calcularVariacionMensual(ResultadoApi resultadoAnterior, ResultadoApi nuevoResultado) {
        double valorAnterior = resultadoAnterior.getValor();
    

        if (valorAnterior != 0) {
            double variacion = ((nuevoResultado.getValor() - valorAnterior) / valorAnterior) * 100;
    
  
            BigDecimal variacionDecimal = new BigDecimal(variacion).setScale(3, RoundingMode.DOWN);
            return variacionDecimal.doubleValue();
        }
    

        return 0.0;
    }
    
    
    public static double calcularPromedioMensual(List<ResultadoApi> resultados, String mes) {
        double suma = 0;
        int count = 0;
    

        for (ResultadoApi resultado : resultados) {
            String mesResultado = resultado.getFecha().substring(0, 7);
    
            if (mesResultado.equals(mes)) {
                suma += resultado.getValor();
                count++;
            }
        }
    

        return (count > 0) ? suma / count : 0.0;
    }
    
    
public static void realizarOperacionesMatematicasAnio(List<ResultadoApi> resultadosVar) {
    Map<String, List<ResultadoApi>> resultadosPorMes = agruparPorMes(resultadosVar);
    List<String> mesesOrdenados = obtenerMesesOrdenados(resultadosVar);

    for (String mes : mesesOrdenados) {
        List<ResultadoApi> resultadosMensuales = resultadosPorMes.get(mes);


        double promedioMes = calcularPromedio(resultadosMensuales);


        double variacionMes = 0.0;
        if (mesesOrdenados.indexOf(mes) > 0) {
            String mesAnterior = mesesOrdenados.get(mesesOrdenados.indexOf(mes) - 1);
            List<ResultadoApi> resultadosMesAnterior = resultadosPorMes.get(mesAnterior);
            if (resultadosMesAnterior != null && !resultadosMesAnterior.isEmpty()) {
                double promedioMesAnterior = calcularPromedio(resultadosMesAnterior);
                variacionMes = calcularVariacion(promedioMesAnterior, promedioMes);
            }
        }

 
         System.out.println("Mes: " + mes + " Promedio: " + String.format("%.3f", promedioMes) + " Variación: " + String.format("%.3f%%", variacionMes));
        


        resultadosVar.add(new ResultadoApi(mes, promedioMes, variacionMes));

        System.out.println("Tamaño de resultadosVar después de agregar: " + resultadosVar.size());
    }
}


    
    
    
    private static Map<String, List<ResultadoApi>> agruparPorMes(List<ResultadoApi> data) {
        Map<String, List<ResultadoApi>> resultadosPorMes = new HashMap<>();
    
        for (ResultadoApi resultado : data) {
            String mes = resultado.getFecha().substring(0, 7);  // Obtener el año y mes
            resultadosPorMes.computeIfAbsent(mes, k -> new ArrayList<>()).add(resultado);
        }
    
        return resultadosPorMes;
    }
    
    

    
    public static double calcularPromedio(List<ResultadoApi> resultados) {
        double suma = resultados.stream().mapToDouble(ResultadoApi::getValor).sum();
        int count = resultados.size();
        return count > 0 ? suma / count : 0.0;
    }
    
    
    private static double calcularVariacion(double valorAnterior, double valorActual) {
        if (valorAnterior != 0.0000) {
            double variacion = ((valorActual - valorAnterior) / valorAnterior) * 100;
            return variacion;
        }
        return 0.0;
    }
    
    
    private static List<String> obtenerMesesOrdenados(List<ResultadoApi> data) {
        Set<String> mesesUnicos = data.stream().map(resultado -> resultado.getFecha().substring(0, 7)).collect(Collectors.toSet());
        return mesesUnicos.stream().sorted().collect(Collectors.toList());
    }
    public static void realizarOperacionesMatematicasMes(List<ResultadoApi> data) {
        Map<String, List<ResultadoApi>> resultadosPorMes = agruparPorMes(data);
        List<String> mesesOrdenados = obtenerMesesOrdenados(data);
    
        for (String mes : mesesOrdenados) {
            List<ResultadoApi> resultadosMensuales = resultadosPorMes.get(mes);
    
    
            double promedioMes = calcularPromedio(resultadosMensuales);
    
    
            double diferenciaPrimerUltimoDia = calcularDiferenciaPrimerUltimoDia(resultadosMensuales);
    
  
            double variacionMes = calcularVariacionMensual(resultadosMensuales);
            
            double modaMes = calcularModa(resultadosMensuales);

            System.out.println("Mes: " + mes + " Promedio: " + String.format("%.3f", promedioMes) +
                    " Diferencia Primer Último Día: " + String.format("%.3f", diferenciaPrimerUltimoDia) +
                    " Variación: " + String.format("%.3f%%", variacionMes)+ " Moda del mes: " + modaMes);
        }
    }
    
    private static double calcularDiferenciaPrimerUltimoDia(List<ResultadoApi> resultadosMensuales) {
        if (resultadosMensuales != null && !resultadosMensuales.isEmpty()) {
            ResultadoApi primerDia = resultadosMensuales.get(0);
            ResultadoApi ultimoDia = resultadosMensuales.get(resultadosMensuales.size() - 1);
    
            return  primerDia.getValor() - ultimoDia.getValor() ;
        }
    
        return 0.0;
    }

    public static List<ResultadoApi> realizarConsultaApiParaCadaDia(String tipoIndicador, String fecha) throws IOException {
        List<ResultadoApi> resultadosTotales = new ArrayList<>();
    

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fechaInicio = LocalDate.parse(fecha + "-01", formatter);
        LocalDate fechaFin = fechaInicio.withDayOfMonth(fechaInicio.lengthOfMonth());
        //System.out.println("Fecha Fin: " + fechaFin);

        for (LocalDate fechaActual = fechaInicio; fechaActual.isBefore(fechaFin) || fechaActual.isEqual(fechaFin); fechaActual = fechaActual.plusDays(1)) {
    
            String fechaActualStr = fechaActual.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            System.out.println("Tipo de Indicador: " + tipoIndicador);
            System.out.println("Fecha Actual Str: " + fechaActualStr);
            try {
                List<ResultadoApi> resultadosDia = realizarConsultaApi(tipoIndicador, fechaActualStr);
                resultadosTotales.addAll(resultadosDia);
            } catch (IOException e) {
       
                e.printStackTrace();
            }
        }
    
        return resultadosTotales;
    }
    public static double calcularVariacionPromedio(List<ResultadoApi> resultados) {
        List<Double> porcentajesVariacion = new ArrayList<>();
    
        for (int i = 1; i < resultados.size(); i++) {
            ResultadoApi resultadoAnterior = resultados.get(i - 1);
            ResultadoApi resultadoActual = resultados.get(i);
    
            double variacion = ((resultadoActual.getValor() - resultadoAnterior.getValor()) / resultadoAnterior.getValor()) * 100;
            porcentajesVariacion.add(variacion);
        }
    

        double promedioVariacion = porcentajesVariacion.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    
        return promedioVariacion;
    }
    
    private static double calcularVariacionMensual(List<ResultadoApi> resultadosMensuales) {
        double sumVariacionDiaria = 0.0;

        if (resultadosMensuales != null && resultadosMensuales.size() > 1) {
            for (int i = 1; i < resultadosMensuales.size(); i++) {
                ResultadoApi diaAnterior = resultadosMensuales.get(i - 1);
                ResultadoApi diaActual = resultadosMensuales.get(i);

                double variacionDiaria = ((diaActual.getValor() - diaAnterior.getValor()) / diaAnterior.getValor()) * 100.0;
                sumVariacionDiaria += variacionDiaria;
            }


            return sumVariacionDiaria / (resultadosMensuales.size() - 1);
        }

        return 0.0;
    }
    private static double calcularModa(List<ResultadoApi> resultados) {

        Map<Double, Integer> frecuenciaMap = new HashMap<>();
    

        for (ResultadoApi resultado : resultados) {
            double valor = resultado.getValor();
            frecuenciaMap.put(valor, frecuenciaMap.getOrDefault(valor, 0) + 1);
        }
    

        double moda = 0.0;
        int frecuenciaMaxima = 0;
    
        for (Map.Entry<Double, Integer> entry : frecuenciaMap.entrySet()) {
            if (entry.getValue() > frecuenciaMaxima) {
                moda = entry.getKey();
                frecuenciaMaxima = entry.getValue();
            }
        }
    
        return moda;
    }
}

