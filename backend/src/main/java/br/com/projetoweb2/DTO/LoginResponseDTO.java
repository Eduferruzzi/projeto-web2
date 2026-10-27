package br.com.projetoweb2.DTO;

import br.com.projetoweb2.model.Usuario;

public record LoginResponseDTO(Integer id, String nome, String login, String perfil) {

    public static LoginResponseDTO de(Usuario usuario) {
        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil());
    }
}
