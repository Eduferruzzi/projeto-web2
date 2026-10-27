package br.com.projetoweb2.usuario;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {
    private final List<Cliente> clientes = new ArrayList<>();
    private final AtomicLong proximoId = new AtomicLong(1);

    @PostMapping("/registro")
    public ResponseEntity<Cliente> registrar(@RequestBody Cliente cliente) {
        if (cliente.getEmail() == null || cliente.getEmail().isBlank()
                || cliente.getCpf() == null || cliente.getCpf().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean emailEmUso = clientes.stream()
                .anyMatch(cadastrado -> cadastrado.getEmail().equalsIgnoreCase(cliente.getEmail()));
        boolean cpfEmUso = clientes.stream()
                .anyMatch(cadastrado -> cadastrado.getCpf().equals(cliente.getCpf()));
        if (emailEmUso || cpfEmUso) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        cliente.setId(proximoId.getAndIncrement());
        clientes.add(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
    }

    @GetMapping
    public List<Cliente> listar() {
        return List.copyOf(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return clientes.stream()
                .filter(cliente -> cliente.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        boolean removido = clientes.removeIf(cliente -> cliente.getId().equals(id));
        return removido
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
