package br.com.projetoweb2.DTO;

public record SolicitacaoRequestDTO(
        Integer clienteId,
        Integer categoriaId,
        String descricaoEquipamento,
        String descricaoDefeito) {
}
