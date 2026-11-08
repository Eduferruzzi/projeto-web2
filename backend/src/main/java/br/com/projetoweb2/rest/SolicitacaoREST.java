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
import br.com.projetoweb2.enums.SolicitacaoStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.repository.FuncionarioRepository;

@CrossOrigin 
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoREST {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitacaoService solicitacaoService;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoREST(SolicitacaoRepository solicitacaoRepository, SolicitacaoService solicitacaoService, FuncionarioRepository funcionarioRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitacaoService = solicitacaoService;
        this.funcionarioRepository = funcionarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(solicitacaoService.listarTodos());
    }   

    @GetMapping("/abertas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarAbertas() {
        return ResponseEntity.ok(solicitacaoService.listarAbertas());
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarAtivas() {
        return ResponseEntity.ok(solicitacaoService.listarAtivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(@PathVariable("id") int id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
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

    @PutMapping("/{id}/orcamento/{funcionarioId}")
    public ResponseEntity<Void> registrarOrcamento(
        @PathVariable("id") Integer id,
        @PathVariable("funcionarioId") Integer funcionarioId,
        @RequestBody Solicitacao dados) {

        if (id == null || id <= 0
                || funcionarioId == null || funcionarioId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        if (dados == null || dados.getValorOrcamento() == null) {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal valor = dados.getValorOrcamento();

        if (valor.compareTo(BigDecimal.ZERO) <= 0
                || valor.scale() > 2
                || valor.compareTo(new BigDecimal("99999999.99")) > 0) {
            return ResponseEntity.badRequest().build();
        }

        Solicitacao solicitacao = solicitacaoRepository
                .findById(id)
                .orElse(null);

        if (solicitacao == null
                || !Boolean.TRUE.equals(solicitacao.getAtivo())) {
            return ResponseEntity.notFound().build();
        }

        if (solicitacao.getStatus() != SolicitacaoStatus.ABERTA) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Funcionario funcionario = funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(funcionarioId)
                .orElse(null);

        if (funcionario == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDateTime agora = LocalDateTime.now();

        solicitacao.setValorOrcamento(valor);
        solicitacao.setDataHoraOrcamento(agora);
        solicitacao.setFuncionarioOrcamento(funcionario);
        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.ORCADA,
                agora,
                funcionario,
                null,
                "Orçamento registrado."
        );
        
        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.noContent().build();
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
