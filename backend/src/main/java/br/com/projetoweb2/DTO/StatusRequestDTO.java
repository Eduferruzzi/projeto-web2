package br.com.projetoweb2.DTO;

public class StatusRequestDTO {
    private Integer funcionarioId;
    private String observacao;
    private String status;
    private String descricaoManutencao;
    private String orientacoesCliente;

    public Integer getFuncionarioId() {
        return funcionarioId;
    }

    public void setFuncionarioId(Integer funcionarioId) {
        this.funcionarioId = funcionarioId;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
