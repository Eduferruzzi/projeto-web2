package br.com.projetoweb2.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


import br.com.projetoweb2.DTO.LoginRequestDTO;
import br.com.projetoweb2.DTO.LoginResponseDTO;
import br.com.projetoweb2.service.LoginService;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
public class LoginREST {

    private final LoginService loginService;

    public LoginREST(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dados, HttpServletRequest request) {
        var usuario = loginService.autenticar(dados);

        if(usuario.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        HttpSession session = request.getSession(true);
        request.changeSessionId();

        session.setAttribute("usuarioid", usuario.get().id());
        session.setMaxInactiveInterval(10 * 60);

        return ResponseEntity.ok(usuario.get());
    }
}
