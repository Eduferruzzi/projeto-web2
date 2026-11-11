
package br.com.projetoweb2.rest;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.projetoweb2.service.FuncionarioService;
import br.com.projetoweb2.model.Funcionario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/funcionarios")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class FuncionarioREST {

    private final FuncionarioService funcionarioService;

    public FuncionarioREST(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping
    public List<Funcionario> listar(HttpServletRequest request) {

        exigirFuncionarioAutenticado(request);
        return funcionarioService.listar();
    }

    @GetMapping("/{id}")
    public Funcionario buscarPorId(
            @PathVariable Integer id, HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        return funcionarioService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(
            @RequestBody Funcionario dados, HttpServletRequest request) {

        exigirFuncionarioAutenticado(request);
        Funcionario criado =
                funcionarioService.criar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(criado);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar(
            @PathVariable Integer id,
            @RequestBody Funcionario dados, HttpServletRequest request) {

        exigirFuncionarioAutenticado(request);
        return funcionarioService.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativar(
            @PathVariable Integer id, HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if(session == null || !(session.getAttribute("usuarioId") instanceof Integer usuarioLogadoId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }

        try {
            funcionarioService.desativar(id, usuarioLogadoId);
        } catch (ResponseStatusException exception) {
            if (exception.getStatusCode().value() == HttpStatus.CONFLICT.value()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", exception.getReason()));
            }
            throw exception;
        }

        return ResponseEntity.noContent().build();
    }

    private void exigirFuncionarioAutenticado(HttpServletRequest request) {
        HttpSession sessao = request.getSession(false);

        if (sessao == null ||
            !(sessao.getAttribute("usuarioId") instanceof Integer usuarioId)) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuário não autenticado."
            );
        }

        funcionarioService.validarFuncionarioAutenticado(usuarioId);
    }
}
