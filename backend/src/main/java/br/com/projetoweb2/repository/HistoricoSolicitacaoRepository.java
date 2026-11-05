package br.com.projetoweb2.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetoweb2.model.HistoricoSolicitacao;

public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Integer> {

    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByDataHoraAsc(Integer solicitacaoId);
}
