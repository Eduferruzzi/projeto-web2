package br.com.projetoweb2.DTO;

public record ClienteRequestDTO(
        String nome,
        String email,
        String senha,
        String cpf,
        String telefone,
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String estado) {
}
