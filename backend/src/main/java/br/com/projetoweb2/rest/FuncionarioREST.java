
package br.com.projetoweb2.rest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.projetoweb2.service.FuncionarioService;
import br.com.projetoweb2.model.Funcionario;

@RestController
@RequestMapping("/funcionarios")
@CrossOrigin(origins = "http://localhost:4200")
public class FuncionarioREST {

    private final FuncionarioService funcionarioService;

    public FuncionarioREST(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping
    public List<Funcionario> listar() {
        return funcionarioService.listar();
    }

    @GetMapping("/{id}")
    public Funcionario buscarPorId(
            @PathVariable Integer id) {
        return funcionarioService.buscar(id);
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(
            @RequestBody Funcionario dados) {

        Funcionario criado =
                funcionarioService.criar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(criado);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar(
            @PathVariable Integer id,
            @RequestBody Funcionario dados) {

        return funcionarioService.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(
            @PathVariable Integer id) {

        funcionarioService.desativar(id);

        return ResponseEntity.noContent().build();
    }
}
