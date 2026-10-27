
package br.com.projetoweb2.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.projetoweb2.DTO.FuncionarioRequestDTO;
import br.com.projetoweb2.DTO.FuncionarioResponseDTO;
import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.Usuario;
import br.com.projetoweb2.repository.FuncionarioRepository;
import br.com.projetoweb2.repository.UsuarioRepository;

//Toda a logica estava em FuncionarioREST, mas foi movida para cá para manter o REST apenas como interface de comunicação com o front
@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public FuncionarioService(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResponseDTO> listar() {
        return funcionarioRepository.findAllByUsuarioAtivoTrue()
                .stream()
                .map(FuncionarioResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionarioResponseDTO buscar(Integer id) {
        Funcionario funcionario = buscarAtivo(id);
        return FuncionarioResponseDTO.de(funcionario);
    }

    @Transactional
    public FuncionarioResponseDTO criar(FuncionarioRequestDTO dados) {
        validar(dados, true);

        String email = normalizarEmail(dados.usuario().email());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail já cadastrado."
            );
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dados.usuario().nome().trim());
        usuario.setEmail(email);
        usuario.setSenha(encoder.encode(dados.usuario().senha()));
        usuario.setPerfil("FUNCIONARIO");
        usuario.setAtivo(true);

        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setDataNascimento(dados.dataNascimento());

        Funcionario salvo = funcionarioRepository.save(funcionario);

        return FuncionarioResponseDTO.de(salvo);
    }

    @Transactional
    public FuncionarioResponseDTO atualizar(
            Integer id,
            FuncionarioRequestDTO dados) {

        validar(dados, false);

        Funcionario funcionario = buscarAtivo(id);
        Usuario usuario = funcionario.getUsuario();

        String email = normalizarEmail(dados.usuario().email());

        if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail já cadastrado."
            );
        }

        usuario.setNome(dados.usuario().nome().trim());
        usuario.setEmail(email);

        String novaSenha = dados.usuario().senha();

        if (novaSenha != null && !novaSenha.isBlank()) {
            usuario.setSenha(encoder.encode(novaSenha));
        }

        funcionario.setDataNascimento(dados.dataNascimento());

        return FuncionarioResponseDTO.de(funcionario);
    }

    @Transactional
    public void desativar(Integer id) {
        Funcionario funcionario = buscarAtivo(id);
        funcionario.getUsuario().setAtivo(false);
    }

    private Funcionario buscarAtivo(Integer id) {
        return funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Funcionário não encontrado."
                ));
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private void validar(
            FuncionarioRequestDTO dados,
            boolean senhaObrigatoria) {

        if (dados == null || dados.usuario() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dados obrigatórios não informados."
            );
        }

        var usuario = dados.usuario();

        if (usuario.nome() == null
                || usuario.nome().trim().length() < 2
                || usuario.nome().trim().length() > 150) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nome inválido."
            );
        }

        String email = usuario.email();

        if (email == null
                || email.trim().length() > 150
                || !email.trim().matches(
                        "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "E-mail inválido."
            );
        }

        if (dados.dataNascimento() == null
                || dados.dataNascimento().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Data de nascimento inválida."
            );
        }

        String senha = usuario.senha();

        if ((senhaObrigatoria
                && (senha == null || senha.isBlank()))
                || (senha != null
                && !senha.isBlank()
                && senha.length() < 8)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha deve ter pelo menos 8 caracteres."
            );
        }
    }
}
