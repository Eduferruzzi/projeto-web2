package br.com.projetoweb2.usuario;

import br.com.projetoweb2.DTO.ClienteRequestDTO;
import br.com.projetoweb2.DTO.ClienteResponseDTO;
import br.com.projetoweb2.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {
    private final ClienteService clienteService;

    public UsuarioController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/registro")
    public ResponseEntity<ClienteResponseDTO> registrar(@RequestBody ClienteRequestDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(dados));
    }

    @GetMapping
    public List<ClienteResponseDTO> listar() {
        return clienteService.listar();
    }

    @GetMapping("/{id}")
    public ClienteResponseDTO buscarPorId(@PathVariable Integer id) {
        return clienteService.buscar(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        clienteService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
