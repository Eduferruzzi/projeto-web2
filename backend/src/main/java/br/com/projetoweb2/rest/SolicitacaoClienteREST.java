package br.com.projetoweb2.rest;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import br.com.projetoweb2.service.LoginService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import br.com.projetoweb2.DTO.RejeicaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.service.SolicitacaoService;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoClienteREST {

    private final SolicitacaoService solicitacaoService;

    private final LoginService loginService;

    public SolicitacaoClienteREST(SolicitacaoService solicitacaoService, LoginService loginService) {
        this.solicitacaoService = solicitacaoService;
        this.loginService = loginService;
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarDoCliente(
            @RequestParam(value = "clienteId", required = false) Integer clienteId, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId));
    }

    @GetMapping("/{id}/cliente")
    public ResponseEntity<SolicitacaoResponseDTO> buscar(
            @PathVariable("id") Integer id,
            @RequestParam(value = "clienteId", required = false) Integer clienteId, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.buscar(id, clienteId));
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponseDTO> aprovar(
            @PathVariable("id") Integer id,
            @RequestParam(value = "clienteId", required = false) Integer clienteId, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.aprovar(id, clienteId));
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponseDTO> rejeitar(
            @PathVariable("id") Integer id,
            @RequestParam(value = "clienteId", required = false) Integer clienteId,
            @RequestBody RejeicaoRequestDTO dados, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.rejeitar(id, clienteId, dados));
    }

    @PutMapping("/{id}/resgatar")
    public ResponseEntity<SolicitacaoResponseDTO> resgatar(
            @PathVariable("id") Integer id,
            @RequestParam(value = "clienteId", required = false) Integer clienteId, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.resgatar(id, clienteId));
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<SolicitacaoResponseDTO> pagar(
            @PathVariable("id") Integer id,
            @RequestParam(value = "clienteId", required = false) Integer clienteId, HttpServletRequest request) {
        clienteId = exigirClienteAutenticado(request, clienteId);
        return ResponseEntity.ok(solicitacaoService.pagar(id, clienteId));
    }
    private Integer exigirClienteAutenticado(HttpServletRequest request, Integer clienteInformado) {
        HttpSession sessao = request.getSession(false);
        if (sessao == null || !(sessao.getAttribute("usuarioId") instanceof Integer usuarioId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado.");
        }
        var usuario = loginService.buscarUsuarioAtivo(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessao invalida."));
        if (!"CLIENTE".equals(usuario.perfil()) ||
                (clienteInformado != null && !usuarioId.equals(clienteInformado))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso nao permitido a este cliente.");
        }
        return usuarioId;
    }
}
