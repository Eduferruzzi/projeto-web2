package br.com.projetoweb2.rest;

import br.com.projetoweb2.DTO.LoginResponseDTO;
import br.com.projetoweb2.service.LoginService;
import br.com.projetoweb2.repository.FuncionarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetoweb2.model.CategoriaEquipamento;
import br.com.projetoweb2.repository.CategoriaEquipamentoRepository;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaEquipamentoRepository repository;

    private final LoginService loginService;
    private final FuncionarioRepository funcionarioRepository;

    public CategoriaEquipamentoController(CategoriaEquipamentoRepository repository,
            LoginService loginService, FuncionarioRepository funcionarioRepository) {
        this.repository = repository;
        this.loginService = loginService;
        this.funcionarioRepository = funcionarioRepository;
    }

    @GetMapping
    public List<CategoriaEquipamento> listar(HttpServletRequest request) {
        exigirAcessoConsulta(request);
        return repository.findByAtivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> buscarPorId(@PathVariable("id") Integer id, HttpServletRequest request) {
        exigirAcessoConsulta(request);
        return repository.findById(id)
                .filter(categoria -> Boolean.TRUE.equals(categoria.getAtivo()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaEquipamento> inserir(@RequestBody CategoriaEquipamento categoria, HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        categoria.setId(null);
        categoria.setAtivo(true);

        CategoriaEquipamento novaCategoria = repository.save(categoria);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> atualizar(
            @PathVariable("id") Integer id,
            @RequestBody CategoriaEquipamento dados, HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        return repository.findById(id)
                .filter(categoria -> Boolean.TRUE.equals(categoria.getAtivo()))
                .map(categoria -> {
                    categoria.setNome(dados.getNome());
                    return ResponseEntity.ok(repository.save(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable("id") Integer id, HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        return repository.findById(id)
                .filter(categoria -> Boolean.TRUE.equals(categoria.getAtivo()))
                .map(categoria -> {
                    categoria.setAtivo(false);
                    repository.save(categoria);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
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

    private void exigirAcessoConsulta(HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if ("FUNCIONARIO".equals(usuario.perfil())) {
            exigirFuncionarioAutenticado(request);
        } else if (!"CLIENTE".equals(usuario.perfil())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Perfil sem permissao de consulta.");
        }
    }
}
