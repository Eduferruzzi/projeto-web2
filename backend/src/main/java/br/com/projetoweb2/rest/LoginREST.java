package br.com.projetoweb2.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetoweb2.DTO.LoginRequestDTO;
import br.com.projetoweb2.DTO.LoginResponseDTO;
import br.com.projetoweb2.service.LoginService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class LoginREST {

    private final LoginService loginService;

    public LoginREST(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dados) {
        return loginService.autenticar(dados)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
