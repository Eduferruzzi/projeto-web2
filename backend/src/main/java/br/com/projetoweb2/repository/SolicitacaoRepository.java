package br.com.projetoweb2.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetoweb2.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
}
