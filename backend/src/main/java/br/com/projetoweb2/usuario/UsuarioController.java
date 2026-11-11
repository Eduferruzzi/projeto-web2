package br.com.projetoweb2.usuario;

import br.com.projetoweb2.DTO.ClienteRequestDTO;
import br.com.projetoweb2.DTO.ClienteResponseDTO;
import br.com.projetoweb2.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.projetoweb2.DTO.LoginResponseDTO;
import br.com.projetoweb2.service.LoginService;
import br.com.projetoweb2.repository.FuncionarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UsuarioController {
    private final ClienteService clienteService;

    private final LoginService loginService;
    private final FuncionarioRepository funcionarioRepository;

    public UsuarioController(ClienteService clienteService, LoginService loginService,
            FuncionarioRepository funcionarioRepository) {
        this.clienteService = clienteService;
        this.loginService = loginService;
        this.funcionarioRepository = funcionarioRepository;
    }

    @PostMapping("/registro")
    public ResponseEntity<ClienteResponseDTO> registrar(@RequestBody ClienteRequestDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.criar(dados));
    }

    @GetMapping
    public List<ClienteResponseDTO> listar(HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        return clienteService.listar();
    }

    @GetMapping("/{id}")
    public ClienteResponseDTO buscarPorId(@PathVariable Integer id, HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if ("CLIENTE".equals(usuario.perfil())) {
            if (!usuario.id().equals(id)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso nao permitido a este cliente.");
            }
        } else {
            exigirFuncionarioAutenticado(request);
        }
        return clienteService.buscar(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id, HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        clienteService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    private LoginResponseDTO exigirUsuarioAutenticado(HttpServletRequest request) {
        HttpSession sessao = request.getSession(false);
        if (sessao == null || !(sessao.getAttribute("usuarioId") instanceof Integer usuarioId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado.");
        }
        return loginService.buscarUsuarioAtivo(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessao invalida."));
    }

    private void exigirFuncionarioAutenticado(HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if (!"FUNCIONARIO".equals(usuario.perfil()) ||
                funcionarioRepository.findByIdAndUsuarioAtivoTrue(usuario.id()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operacao exclusiva de funcionario.");
        }
    }
}
