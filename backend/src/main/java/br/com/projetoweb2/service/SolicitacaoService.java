package br.com.projetoweb2.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.projetoweb2.DTO.RejeicaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.model.Solicitacao;
import br.com.projetoweb2.repository.SolicitacaoClienteRepository;

@Service
public class SolicitacaoService {

    private static final int TAMANHO_MINIMO_MOTIVO = 5;

    private final SolicitacaoClienteRepository solicitacaoRepository;

    public SolicitacaoService(SolicitacaoClienteRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscar(Integer id, Integer clienteId) {
        return SolicitacaoResponseDTO.de(buscarDoCliente(id, clienteId));
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorCliente(Integer clienteId) {
        if (clienteId == null || clienteId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente nao informado.");
        }
        return solicitacaoRepository.listarPorCliente(clienteId)
                .stream()
                .map(SolicitacaoResponseDTO::de)
                .sorted(Comparator.comparing(
                        SolicitacaoResponseDTO::dataHora,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    @Transactional
    public SolicitacaoResponseDTO aprovar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ORCADA,
                "Somente uma solicitacao orcada pode ser aprovada.");

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.APROVADA,
                LocalDateTime.now(),
                null,
                null,
                "Orcamento aprovado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO rejeitar(Integer id, Integer clienteId, RejeicaoRequestDTO dados) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ORCADA,
                "Somente uma solicitacao orcada pode ser rejeitada.");

        String motivo = validarMotivo(dados);
        solicitacao.setMotivoRejeicao(motivo);

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.REJEITADA,
                LocalDateTime.now(),
                null,
                null,
                motivo);

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO resgatar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.REJEITADA,
                "Somente uma solicitacao rejeitada pode ser resgatada.");

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.APROVADA,
                LocalDateTime.now(),
                null,
                null,
                "Servico resgatado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO pagar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ARRUMADA,
                "Somente uma solicitacao arrumada pode ser paga.");

        LocalDateTime agora = LocalDateTime.now();
        solicitacao.setDataHoraPagamento(agora);

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.PAGA,
                agora,
                null,
                null,
                "Pagamento confirmado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    private Solicitacao buscarDoCliente(Integer id, Integer clienteId) {
        if (clienteId == null || clienteId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente nao informado.");
        }

        Solicitacao solicitacao = solicitacaoRepository.buscarComHistorico(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitacao nao encontrada."));

        if (!solicitacao.getCliente().getId().equals(clienteId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Esta solicitacao pertence a outro cliente.");
        }

        return solicitacao;
    }

    private void exigirEstado(Solicitacao solicitacao, SolicitacaoStatus esperado, String mensagem) {
        if (solicitacao.getStatus() != esperado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    mensagem + " Estado atual: " + solicitacao.getStatus().name() + ".");
        }
    }

    private String validarMotivo(RejeicaoRequestDTO dados) {
        if (dados == null || dados.motivo() == null || dados.motivo().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Informe o motivo da rejeicao.");
        }

        String motivo = dados.motivo().trim();
        if (motivo.length() < TAMANHO_MINIMO_MOTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O motivo deve ter pelo menos " + TAMANHO_MINIMO_MOTIVO + " caracteres.");
        }

        return motivo;
    }
}
