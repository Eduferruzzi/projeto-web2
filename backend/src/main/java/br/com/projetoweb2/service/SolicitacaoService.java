package br.com.projetoweb2.service;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import br.com.projetoweb2.DTO.SolicitacaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.model.Solicitacao;
import br.com.projetoweb2.repository.CategoriaEquipamentoRepository;
import br.com.projetoweb2.repository.ClienteRepository;
import br.com.projetoweb2.repository.SolicitacaoRepository;

@Service
public class SolicitacaoService {
    private final SolicitacaoRepository solicitacaoRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaEquipamentoRepository categoriaRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
            ClienteRepository clienteRepository, CategoriaEquipamentoRepository categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.clienteRepository = clienteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public SolicitacaoResponseDTO criar(SolicitacaoRequestDTO dados) {
        validar(dados);

        var cliente = clienteRepository.findByIdAndUsuarioAtivoTrue(dados.clienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado."));
        var categoria = categoriaRepository.findById(dados.categoriaId())
                .filter(c -> Boolean.TRUE.equals(c.getAtivo()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada ou inativa."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricaoEquipamento(dados.descricaoEquipamento().trim());
        solicitacao.setDescricaoDefeito(dados.descricaoDefeito().trim());
        solicitacao.setDataHoraAbertura(LocalDateTime.now());
        solicitacao.setEstado(SolicitacaoStatus.ABERTA);
        solicitacao.setAtivo(true);

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    private void validar(SolicitacaoRequestDTO dados) {
        if (dados == null || dados.clienteId() == null || dados.clienteId() <= 0
                || dados.categoriaId() == null || dados.categoriaId() <= 0
                || dados.descricaoEquipamento() == null || dados.descricaoEquipamento().isBlank()
                || dados.descricaoDefeito() == null || dados.descricaoDefeito().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha todos os campos obrigatórios.");
        }
    }
}
