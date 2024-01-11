package PruebaTecnica.ConsultaAPI.modelo;

public class ResultadoApi {
    private String fecha;
    private double valor;
    private double promedio; 
    private double variacion;

    public ResultadoApi(String fecha, double valor) {
        this.fecha = fecha;
        this.valor = valor;
    }
    public ResultadoApi(String fecha, double promedio, double variacion) {
        this.fecha = fecha;
        this.promedio = promedio;
        this.variacion = variacion;
    }
    public String toString() {
        return "ResultadoApi{" +
                "fecha=" + fecha +
                ", valor=" + valor +
                ", promedio=" + promedio+
                ", variacion=" + variacion+
                
                '}';
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public double getPromedio() {
        return promedio;
    }

    public void setPromedio(double promedio) {
        this.promedio = promedio;
    }

    public double getVariacion() {
        return variacion;
    }

    public void setVariacion(double variacion) {
        this.variacion = variacion;
    }


}

