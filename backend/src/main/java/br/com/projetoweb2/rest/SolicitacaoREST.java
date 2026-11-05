package br.com.projetoweb2.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetoweb2.model.Solicitacao;
import br.com.projetoweb2.repository.SolicitacaoRepository;
import br.com.projetoweb2.DTO.SolicitacaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.service.SolicitacaoService;

@CrossOrigin 
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoREST {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitacaoService solicitacaoService;

    public SolicitacaoREST(SolicitacaoRepository solicitacaoRepository, SolicitacaoService solicitacaoService){
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitacaoService = solicitacaoService;
    }

    public List<Solicitacao> listar() {
        return solicitacaoRepository.findAll();
    }

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodos() {
        return ResponseEntity.ok(solicitacaoRepository.findAll()
                .stream()
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable("id") int id) {
        Solicitacao s = this.listar().stream().filter(sol -> sol.getId() == id)
                                    .findAny().orElse(null);
        if(s == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        else
            return ResponseEntity.ok(s);
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> inserir(@RequestBody SolicitacaoRequestDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.criar(dados));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitacao> alterar(@PathVariable("id") int id, @RequestBody Solicitacao solicitacao) {
        Solicitacao s = this.listar().stream().filter(sol -> sol.getId().equals(id))
                                    .findAny().orElse(null);
        if(s == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        solicitacaoRepository.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Solicitacao> desativar(@PathVariable("id") int id) {
        Solicitacao s = this.listar().stream().filter(sol -> sol.getId().equals(id))
                                    .findAny().orElse(null);
        if(s == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        s.setAtivo(false);
        solicitacaoRepository.save(s);
        return ResponseEntity.ok(s);
    }
}
