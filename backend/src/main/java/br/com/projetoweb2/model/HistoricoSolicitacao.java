package br.com.projetoweb2.model;

import java.time.LocalDateTime;

import br.com.projetoweb2.enums.SolicitacaoStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historico_solicitacao")
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private SolicitacaoStatus estadoAnterior;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_novo", nullable = false)
    private SolicitacaoStatus estadoNovo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "funcionario_origem_id")
    private Funcionario funcionarioOrigem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "funcionario_destino_id")
    private Funcionario funcionarioDestino;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(Solicitacao solicitacao) {
        this.solicitacao = solicitacao;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public SolicitacaoStatus getEstadoAnterior() {
        return estadoAnterior;
    }

    public void setEstadoAnterior(SolicitacaoStatus estadoAnterior) {
        this.estadoAnterior = estadoAnterior;
    }

    public SolicitacaoStatus getEstadoNovo() {
        return estadoNovo;
    }

    public void setEstadoNovo(SolicitacaoStatus estadoNovo) {
        this.estadoNovo = estadoNovo;
    }

    public Funcionario getFuncionarioOrigem() {
        return funcionarioOrigem;
    }

    public void setFuncionarioOrigem(Funcionario funcionarioOrigem) {
        this.funcionarioOrigem = funcionarioOrigem;
    }

    public Funcionario getFuncionarioDestino() {
        return funcionarioDestino;
    }

    public void setFuncionarioDestino(Funcionario funcionarioDestino) {
        this.funcionarioDestino = funcionarioDestino;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
