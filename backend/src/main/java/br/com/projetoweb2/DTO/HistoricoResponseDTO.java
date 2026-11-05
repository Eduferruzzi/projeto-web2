package br.com.projetoweb2.DTO;

import java.time.LocalDateTime;

import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.HistoricoSolicitacao;

public record HistoricoResponseDTO(
        Integer id,
        LocalDateTime dataHora,
        String estadoAnterior,
        String estadoNovo,
        String funcionarioOrigem,
        String funcionarioDestino,
        String observacao) {

    public static HistoricoResponseDTO de(HistoricoSolicitacao passo) {
        return new HistoricoResponseDTO(
                passo.getId(),
                passo.getDataHora(),
                passo.getEstadoAnterior() == null ? null : passo.getEstadoAnterior().name(),
                passo.getEstadoNovo().name(),
                nomeDoFuncionario(passo.getFuncionarioOrigem()),
                nomeDoFuncionario(passo.getFuncionarioDestino()),
                passo.getObservacao());
    }

    private static String nomeDoFuncionario(Funcionario funcionario) {
        if (funcionario == null || funcionario.getUsuario() == null) {
            return null;
        }
        return funcionario.getUsuario().getNome();
    }
}
