package br.com.projetoweb2.DTO;

import br.com.projetoweb2.usuario.Cliente;

public record ClienteResponseDTO(
        Integer id,
        String nome,
        String email,
        String perfil) {

    public static ClienteResponseDTO de(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getUsuario().getNome(),
                cliente.getUsuario().getEmail(),
                cliente.getUsuario().getPerfil());
    }
}
