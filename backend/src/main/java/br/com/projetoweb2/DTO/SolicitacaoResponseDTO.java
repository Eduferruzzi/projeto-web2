package br.com.projetoweb2.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.Solicitacao;

public record SolicitacaoResponseDTO(
        Integer id,
        LocalDateTime dataHora,
        String descricaoEquipamento,
        String categoria,
        String descricaoDefeito,
        String estado,
        Integer clienteId,
        String cliente,
        BigDecimal valorOrcamento,
        LocalDateTime dataHoraOrcamento,
        String funcionarioOrcamento,
        String motivoRejeicao,
        String descricaoManutencao,
        String orientacoesCliente,
        LocalDateTime dataHoraPagamento,
        LocalDateTime dataHoraFinalizacao,
        String funcionarioResponsavel,
        List<HistoricoResponseDTO> historico) {

    public static SolicitacaoResponseDTO de(Solicitacao solicitacao) {
        return new SolicitacaoResponseDTO(
                solicitacao.getId(),
                dataDeAbertura(solicitacao),
                solicitacao.getDescricaoEquipamento(),
                solicitacao.getCategoria() == null ? null : solicitacao.getCategoria().getNome(),
                solicitacao.getDescricaoDefeito(),
                solicitacao.getStatus().name(),
                solicitacao.getCliente() == null ? null : solicitacao.getCliente().getId(),
                nomeDoCliente(solicitacao),
                solicitacao.getValorOrcamento(),
                solicitacao.getDataHoraOrcamento(),
                nomeDoFuncionario(solicitacao.getFuncionarioOrcamento()),
                solicitacao.getMotivoRejeicao(),
                solicitacao.getDescricaoManutencao(),
                solicitacao.getOrientacoesCliente(),
                solicitacao.getDataHoraPagamento(),
                solicitacao.getDataHoraFinalizacao(),
                nomeDoFuncionario(solicitacao.getFuncionarioAtual()),
                solicitacao.getHistorico()
                        .stream()
                        .map(HistoricoResponseDTO::de)
                        .toList());
    }

    private static LocalDateTime dataDeAbertura(Solicitacao solicitacao) {
        return solicitacao.getHistorico()
                .stream()
                .map(passo -> passo.getDataHora())
                .min(LocalDateTime::compareTo)
                .orElse(null);
    }

    private static String nomeDoCliente(Solicitacao solicitacao) {
        if (solicitacao.getCliente() == null || solicitacao.getCliente().getUsuario() == null) {
            return null;
        }
        return solicitacao.getCliente().getUsuario().getNome();
    }

    private static String nomeDoFuncionario(Funcionario funcionario) {
        if (funcionario == null || funcionario.getUsuario() == null) {
            return null;
        }
        return funcionario.getUsuario().getNome();
    }
}
