package br.com.projetoweb2.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;

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

        Integer usuarioId = usuario.get().id();

        session.setAttribute("usuarioId", usuarioId);

        return ResponseEntity.ok(usuario.get());
    }

    @GetMapping("/sessao")
    public ResponseEntity<LoginResponseDTO> consultarSessao(
            HttpServletRequest request) {

        HttpSession sessao = request.getSession(false);

        if (sessao == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object usuarioId = sessao.getAttribute("usuarioId");

        if (!(usuarioId instanceof Integer id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return loginService.buscarUsuarioAtivo(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    sessao.invalidate();
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                });
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        HttpSession sessao = request.getSession(false);

        if (sessao != null) {
            sessao.invalidate();
        }

        return ResponseEntity.noContent().build();
    }
}
