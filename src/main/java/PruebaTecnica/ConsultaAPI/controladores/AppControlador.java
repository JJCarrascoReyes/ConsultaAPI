package PruebaTecnica.ConsultaAPI.controladores;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppControlador {

    @GetMapping("/mostrar-index")
    public String mostrarIndex() {
        return "index";
    }


}
