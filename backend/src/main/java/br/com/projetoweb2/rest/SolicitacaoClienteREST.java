package br.com.projetoweb2.rest;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

@CrossOrigin
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoClienteREST {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoClienteREST(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarDoCliente(
            @RequestParam("clienteId") Integer clienteId) {
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId));
    }

    @GetMapping("/{id}/cliente")
    public ResponseEntity<SolicitacaoResponseDTO> buscar(
            @PathVariable("id") Integer id,
            @RequestParam("clienteId") Integer clienteId) {
        return ResponseEntity.ok(solicitacaoService.buscar(id, clienteId));
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponseDTO> aprovar(
            @PathVariable("id") Integer id,
            @RequestParam("clienteId") Integer clienteId) {
        return ResponseEntity.ok(solicitacaoService.aprovar(id, clienteId));
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponseDTO> rejeitar(
            @PathVariable("id") Integer id,
            @RequestParam("clienteId") Integer clienteId,
            @RequestBody RejeicaoRequestDTO dados) {
        return ResponseEntity.ok(solicitacaoService.rejeitar(id, clienteId, dados));
    }

    @PutMapping("/{id}/resgatar")
    public ResponseEntity<SolicitacaoResponseDTO> resgatar(
            @PathVariable("id") Integer id,
            @RequestParam("clienteId") Integer clienteId) {
        return ResponseEntity.ok(solicitacaoService.resgatar(id, clienteId));
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<SolicitacaoResponseDTO> pagar(
            @PathVariable("id") Integer id,
            @RequestParam("clienteId") Integer clienteId) {
        return ResponseEntity.ok(solicitacaoService.pagar(id, clienteId));
    }
}
