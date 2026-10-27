package br.com.projetoweb2.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetoweb2.DTO.LoginRequestDTO;
import br.com.projetoweb2.DTO.LoginResponseDTO;
import br.com.projetoweb2.repository.UsuarioRepository;

@Service
public class LoginService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public LoginService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public Optional<LoginResponseDTO> autenticar(LoginRequestDTO dados) {
        if (dados == null || dados.login() == null || dados.login().isBlank()
                || dados.senha() == null || dados.senha().isBlank()) {
            return Optional.empty();
        }

        return usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(dados.login().trim())
                .filter(usuario -> encoder.matches(dados.senha(), usuario.getSenha()))
                .map(LoginResponseDTO::de);
    }
}
