package br.com.projetoweb2.rest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetoweb2.model.Solicitacao;

@CrossOrigin 
@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoREST {

    public static List<Solicitacao> lista = new ArrayList<>();

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodos() {
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable("id") int id) {
        Solicitacao s = lista.stream().filter(sol -> sol.getId() == id)
                                    .findAny().orElse(null);
        if(s == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        else
            return ResponseEntity.ok(s);
    }

    @PostMapping
    public ResponseEntity<Solicitacao> inserir(@RequestBody Solicitacao solicitacao) {
        Solicitacao s = lista.stream().filter(sol -> sol.getId().equals(solicitacao.getId()))
                                    .findAny().orElse(null);
        if(s != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        s = lista.stream().max(Comparator.comparing(Solicitacao::getId))
                            .orElse(null);
        if (s == null)
            solicitacao.setId(1);
        else
            solicitacao.setId(s.getId() + 1);
        lista.add(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacao);
    }
}
