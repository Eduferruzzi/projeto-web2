package br.com.projetoweb2.rest;

import java.util.Comparator;
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

@CrossOrigin 
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoREST {

    private final SolicitacaoRepository solicitacaoRepository;

    public SolicitacaoREST(SolicitacaoRepository solicitacaoRepository){
        this.solicitacaoRepository = solicitacaoRepository;
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
    public ResponseEntity<Solicitacao> inserir(@RequestBody Solicitacao solicitacao) {
        Solicitacao s = this.listar().stream().filter(sol -> sol.getId().equals(solicitacao.getId()))
                                    .findAny().orElse(null);
        if(s != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        s = this.listar().stream().max(Comparator.comparing(Solicitacao::getId))
                            .orElse(null);
        if (s == null)
            solicitacao.setId(1);
        else
            solicitacao.setId(s.getId() + 1);
        solicitacaoRepository.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
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
