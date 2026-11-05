package br.com.projetoweb2.DTO;

import java.time.LocalDateTime;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.model.Solicitacao;

public record SolicitacaoResponseDTO(
        Integer id,
        LocalDateTime dataHoraAbertura,
        SolicitacaoStatus estado) {

    public static SolicitacaoResponseDTO de(Solicitacao solicitacao) {
        return new SolicitacaoResponseDTO(solicitacao.getId(),
                solicitacao.getDataHoraAbertura(), solicitacao.getEstado());
    }
}
