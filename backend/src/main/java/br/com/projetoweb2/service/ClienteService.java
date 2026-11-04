package br.com.projetoweb2.service;

import br.com.projetoweb2.DTO.ClienteRequestDTO;
import br.com.projetoweb2.DTO.ClienteResponseDTO;
import br.com.projetoweb2.model.Usuario;
import br.com.projetoweb2.repository.ClienteRepository;
import br.com.projetoweb2.repository.UsuarioRepository;
import br.com.projetoweb2.usuario.Cliente;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    public ClienteService(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            PasswordService passwordService) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listar() {
        return clienteRepository.findAllByUsuarioAtivoTrue()
                .stream()
                .map(ClienteResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscar(Integer id) {
        return ClienteResponseDTO.de(buscarAtivo(id));
    }

    @Transactional
    public ClienteResponseDTO criar(ClienteRequestDTO dados) {
        validar(dados);

        String email = normalizar(dados.email());
        String cpf = dados.cpf().trim();

        if (usuarioRepository.existsByEmailIgnoreCase(email) || clienteRepository.existsByCpf(cpf)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail ou CPF já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dados.nome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordService.hash(dados.senha()));
        usuario.setPerfil("CLIENTE");
        usuario.setAtivo(true);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setCpf(cpf);
        cliente.setTelefone(dados.telefone().trim());
        cliente.setCep(dados.cep().trim());
        cliente.setLogradouro(dados.logradouro().trim());
        cliente.setNumero(dados.numero().trim());
        cliente.setComplemento(vazioParaNull(dados.complemento()));
        cliente.setBairro(dados.bairro().trim());
        cliente.setCidade(dados.cidade().trim());
        cliente.setEstado(dados.estado().trim().toUpperCase(Locale.ROOT));

        return ClienteResponseDTO.de(clienteRepository.save(cliente));
    }

    @Transactional
    public void desativar(Integer id) {
        buscarAtivo(id).getUsuario().setAtivo(false);
    }

    private Cliente buscarAtivo(Integer id) {
        return clienteRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado."));
    }

    private void validar(ClienteRequestDTO dados) {
        if (dados == null
                || vazio(dados.nome()) || vazio(dados.email()) || vazio(dados.senha())
                || vazio(dados.cpf()) || vazio(dados.telefone()) || vazio(dados.cep())
                || vazio(dados.logradouro()) || vazio(dados.numero()) || vazio(dados.bairro())
                || vazio(dados.cidade()) || vazio(dados.estado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha todos os campos obrigatórios.");
        }
        if (dados.nome().trim().length() < 2 || dados.nome().trim().length() > 150) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome inválido.");
        }
        if (dados.email().trim().length() > 150
                || !dados.email().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail inválido.");
        }
        if (dados.senha().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha deve ter pelo menos 8 caracteres.");
        }
        if (dados.estado().trim().length() != 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido.");
        }
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }

    private String normalizar(String valor) {
        return valor.trim().toLowerCase(Locale.ROOT);
    }

    private String vazioParaNull(String valor) {
        return vazio(valor) ? null : valor.trim();
    }
}
