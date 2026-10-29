package br.com.projetoweb2.DTO;

import java.time.LocalDate;

public record FuncionarioRequestDTO(
        LocalDate dataNascimento,
        UsuarioDados usuario)
        {
        
        public record UsuarioDados(
                String nome,
                String email,
                String senha) {
        }
}

// id, perfil e ativo não são passados no request, pois são sao controlados pelo form