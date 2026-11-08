package br.com.projetoweb2.DTO;

public class RedirecionamentoRequestDTO {
    private Integer funcionarioOrigemId;
    private Integer funcionarioDestinoId;

    public Integer getFuncionarioOrigemId() {
        return funcionarioOrigemId;
    }

    public void setFuncionarioOrigemId(Integer funcionarioOrigemId) {
        this.funcionarioOrigemId = funcionarioOrigemId;
    }

    public Integer getFuncionarioDestinoId() {
        return funcionarioDestinoId;
    }

    public void setFuncionarioDestinoId(Integer funcionarioDestinoId) {
        this.funcionarioDestinoId = funcionarioDestinoId;
    }
}
