package br.com.projetoweb2.DTO;
import java.time.LocalDate;
import br.com.projetoweb2.model.Funcionario;


public record FuncionarioResponseDTO(
    Integer id,
    LocalDate dataNascimento,
    UsuarioDados usuario
){
    public record UsuarioDados(
        String nome,
        String email
    ){}

    public static FuncionarioResponseDTO de(Funcionario funcionario) {
        return new FuncionarioResponseDTO(
            funcionario.getId(),
            funcionario.getDataNascimento(),
            new UsuarioDados(
                funcionario.getUsuario().getNome(),
                funcionario.getUsuario().getEmail()
            )
        );
    }
}
