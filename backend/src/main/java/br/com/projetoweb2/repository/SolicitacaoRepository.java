package br.com.projetoweb2.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Integer> {
    List<Solicitacao> findByAtivoTrueAndStatus(SolicitacaoStatus status);
    List<Solicitacao> findByAtivoTrueOrderByDataHoraAberturaAsc();

    @Query("""
            SELECT DISTINCT s FROM Solicitacao s
            JOIN FETCH s.cliente c
            JOIN FETCH c.usuario
            JOIN FETCH s.categoria
            LEFT JOIN FETCH s.historicoSolicitacoes h
            LEFT JOIN FETCH h.funcionarioOrigem fo
            LEFT JOIN FETCH fo.usuario
            WHERE s.id = :id AND (s.ativo IS NULL OR s.ativo = true)
            """)
    Optional<Solicitacao> buscarComHistorico(@Param("id") Integer id);

    @Query("""
            SELECT DISTINCT s FROM Solicitacao s
            JOIN FETCH s.cliente c
            JOIN FETCH c.usuario
            JOIN FETCH s.categoria
            LEFT JOIN FETCH s.historicoSolicitacoes
            WHERE c.id = :clienteId AND (s.ativo IS NULL OR s.ativo = true)
            """)
    List<Solicitacao> listarPorCliente(@Param("clienteId") Integer clienteId);

        // RF013 - Solicitações visíveis para determinado funcionário
        @Query("""
        SELECT s
        FROM Solicitacao s
        WHERE s.ativo = true
        AND (
                s.status <> :estadoRedirecionada
                OR s.funcionarioAtual.id = :funcionarioId
        )
        ORDER BY s.dataHoraAbertura ASC
        """)
        List<Solicitacao> listarVisiveisFuncionario(
                @Param("funcionarioId") Integer funcionarioId,
                @Param("estadoRedirecionada") SolicitacaoStatus estadoRedirecionada
        );

        // Solicitações atribuídas ao funcionário
        @Query("""
        SELECT s
        FROM Solicitacao s
        WHERE s.ativo = true
        AND s.funcionarioAtual.id = :funcionarioId
        ORDER BY s.dataHoraAbertura ASC
        """)
        List<Solicitacao> listarAtribuidasFuncionario(
                @Param("funcionarioId") Integer funcionarioId
        );
}
