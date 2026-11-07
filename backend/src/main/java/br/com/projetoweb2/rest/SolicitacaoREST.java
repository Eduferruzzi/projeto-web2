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
import org.springframework.web.bind.annotation.RequestParam;


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

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarTodos() {
        return ResponseEntity.ok(solicitacaoRepository.findAll());
    }   

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable("id") int id) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id).orElse(null);

        if (solicitacao == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(solicitacao);
    }
    

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> inserir(@RequestBody SolicitacaoRequestDTO dados) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.criar(dados));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitacao> alterar(@PathVariable ("id") int id, @RequestBody Solicitacao dados) {
            Solicitacao solicitacao = solicitacaoRepository.findById(id).orElse(null);

            if (solicitacao == null || !Boolean.TRUE.equals(solicitacao.getAtivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            if(dados.getDescricaoEquipamento() == null || 
                dados.getDescricaoEquipamento().isBlank() || 
                dados.getDescricaoDefeito() == null || 
                dados.getDescricaoDefeito().isBlank() ){

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            solicitacao.setDescricaoEquipamento(dados.getDescricaoEquipamento().trim());

            solicitacao.setDescricaoDefeito(dados.getDescricaoDefeito().trim());

            solicitacaoRepository.save(solicitacao);

            return ResponseEntity.ok(solicitacao);

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Solicitacao> desativar(@PathVariable("id") int id) {
        
        Solicitacao solicitacao = solicitacaoRepository.findById(id).orElse(null);

        if(solicitacao == null || !Boolean.TRUE.equals(solicitacao.getAtivo())){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        solicitacao.setAtivo(false);
        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
