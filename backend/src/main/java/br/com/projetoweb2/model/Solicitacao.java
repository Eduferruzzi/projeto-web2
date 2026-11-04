package br.com.projetoweb2.model;

import br.com.projetoweb2.enums.SolicitacaoStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.usuario.Cliente;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // dados do equipamento e defeito

    @Column(nullable = false)
    private String descricaoEquipamento;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricaoDefeito;

    // categoria do equipamento, que será usada para filtrar os funcionários que podem atender a solicitação,
    @Column(name = "categoria_id")
    private Integer categoriaId;


    // cliente

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;


    // controle de solicitacao 

    @Column(nullable = false)
    private Boolean ativo = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SolicitacaoStatus status = SolicitacaoStatus.ABERTA;

    @Column(nullable = false)
    private LocalDateTime dataHoraAbertura;


    // orcamento

    @Column(precision = 12, scale = 2)
    private BigDecimal valorOrcamento;

    private LocalDateTime dataHoraOrcamento;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_orcamento_id")
    private Funcionario funcionarioOrcamento;


    // rejeicao 

    @Column(columnDefinition = "TEXT")
    private String motivoRejeicao;


    // manutencao

    @Column(columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(columnDefinition = "TEXT")
    private String orientacoesCliente;

    private LocalDateTime dataHoraManutencao;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_responsavel_id")
    private Funcionario funcionarioResponsavel;


    // redirecionamento

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_redirecionado_id")
    private Funcionario funcionarioRedirecionado;


    // pagamento

    private LocalDateTime dataHoraPagamento;


    // finalizacao

    private LocalDateTime dataHoraFinalizacao;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_finalizacao_id")
    private Funcionario funcionarioFinalizacao;


    // data de abertura automatica 

    @PrePersist
    public void antesDeSalvar() {
        if (dataHoraAbertura == null) {
            dataHoraAbertura = LocalDateTime.now();
        }
    }

    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public SolicitacaoStatus getStatus() {
        return status;
    }

    public void setStatus(SolicitacaoStatus status) {
        this.status = status;
    }

    public LocalDateTime getDataHoraAbertura() {
        return dataHoraAbertura;
    }

    public void setDataHoraAbertura(LocalDateTime dataHoraAbertura) {
        this.dataHoraAbertura = dataHoraAbertura;
    }

    public BigDecimal getValorOrcamento() {
        return valorOrcamento;
    }

    public void setValorOrcamento(BigDecimal valorOrcamento) {
        this.valorOrcamento = valorOrcamento;
    }

    public LocalDateTime getDataHoraOrcamento() {
        return dataHoraOrcamento;
    }

    public void setDataHoraOrcamento(LocalDateTime dataHoraOrcamento) {
        this.dataHoraOrcamento = dataHoraOrcamento;
    }

    public Funcionario getFuncionarioOrcamento() {
        return funcionarioOrcamento;
    }

    public void setFuncionarioOrcamento(Funcionario funcionarioOrcamento) {
        this.funcionarioOrcamento = funcionarioOrcamento;
    }

    public String getMotivoRejeicao() {
        return motivoRejeicao;
    }

    public void setMotivoRejeicao(String motivoRejeicao) {
        this.motivoRejeicao = motivoRejeicao;
    }

    public String getDescricaoManutencao() {
        return descricaoManutencao;
    }

    public void setDescricaoManutencao(String descricaoManutencao) {
        this.descricaoManutencao = descricaoManutencao;
    }

    public String getOrientacoesCliente() {
        return orientacoesCliente;
    }

    public void setOrientacoesCliente(String orientacoesCliente) {
        this.orientacoesCliente = orientacoesCliente;
    }

    public LocalDateTime getDataHoraManutencao() {
        return dataHoraManutencao;
    }

    public void setDataHoraManutencao(LocalDateTime dataHoraManutencao) {
        this.dataHoraManutencao = dataHoraManutencao;
    }

    public Funcionario getFuncionarioResponsavel() {
        return funcionarioResponsavel;
    }

    public void setFuncionarioResponsavel(Funcionario funcionarioResponsavel) {
        this.funcionarioResponsavel = funcionarioResponsavel;
    }

    public Funcionario getFuncionarioRedirecionado() {
        return funcionarioRedirecionado;
    }

    public void setFuncionarioRedirecionado(Funcionario funcionarioRedirecionado) {
        this.funcionarioRedirecionado = funcionarioRedirecionado;
    }

    public LocalDateTime getDataHoraPagamento() {
        return dataHoraPagamento;
    }

    public void setDataHoraPagamento(LocalDateTime dataHoraPagamento) {
        this.dataHoraPagamento = dataHoraPagamento;
    }

    public LocalDateTime getDataHoraFinalizacao() {
        return dataHoraFinalizacao;
    }

    public void setDataHoraFinalizacao(LocalDateTime dataHoraFinalizacao) {
        this.dataHoraFinalizacao = dataHoraFinalizacao;
    }

    public Funcionario getFuncionarioFinalizacao() {
        return funcionarioFinalizacao;
    }

    public void setFuncionarioFinalizacao(Funcionario funcionarioFinalizacao) {
        this.funcionarioFinalizacao = funcionarioFinalizacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getDescricaoEquipamento() {
        return descricaoEquipamento;
    }
    
    public void setDescricaoEquipamento(String descricaoEquipamento) {
        this.descricaoEquipamento = descricaoEquipamento;
    }
    
    public String getDescricaoDefeito() {
        return descricaoDefeito;
    }

    public void setDescricaoDefeito(String descricaoDefeito) {
        this.descricaoDefeito = descricaoDefeito;
    }

    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
