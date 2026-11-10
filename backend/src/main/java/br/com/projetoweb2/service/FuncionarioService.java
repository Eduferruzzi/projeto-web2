
package br.com.projetoweb2.service;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.Usuario;
import br.com.projetoweb2.repository.FuncionarioRepository;
import br.com.projetoweb2.repository.UsuarioRepository;


//Toda a logica estava em FuncionarioREST, mas foi movida para cá para manter o REST apenas como interface de comunicação com o front
@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    public FuncionarioService(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository,
            PasswordService passwordService) {
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    @Transactional(readOnly = true)
    public List<Funcionario> listar() {
        return funcionarioRepository.findAllByUsuarioAtivoTrue();
    }

    @Transactional(readOnly = true)
    public Funcionario buscar(Integer id) {
        return buscarAtivo(id);
    }

    @Transactional
    public Funcionario criar(Funcionario dados) {
        validar(dados, true);

        Usuario dadosusuario = dados.getUsuario();
        String email = normalizarEmail(dadosusuario.getEmail());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "e-mail ja cadastrado."
            );
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dadosusuario.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordService.hash(dadosusuario.getSenha()));
        usuario.setPerfil("FUNCIONARIO");
        usuario.setAtivo(true);

        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setDataNascimento(dados.getDataNascimento());

        return funcionarioRepository.save(funcionario);
    }

    @Transactional
    public Funcionario atualizar(
            Integer id,
            Funcionario dados) {

        validar(dados, false);

        Funcionario funcionario = buscarAtivo(id);
        Usuario usuario = funcionario.getUsuario();

        String email = normalizarEmail(dados.getUsuario().getEmail());

        if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "e-mail ja cadastrado."
            );
        }

        usuario.setNome(dados.getUsuario().getNome().trim());
        usuario.setEmail(email);

        String novaSenha = dados.getUsuario().getSenha();

        if (novaSenha != null && !novaSenha.isBlank()) {
            usuario.setSenha(passwordService.hash(novaSenha));
        }

        funcionario.setDataNascimento(dados.getDataNascimento());

        return funcionario;
    }

    @Transactional
    public void desativar(Integer id, Integer usuarioLogadoId) {

        if(funcionarioRepository.findByIdAndUsuarioAtivoTrue(usuarioLogadoId).isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario sem permissao"
            );
        }

        if(id.equals(usuarioLogadoId)){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voce nao pode desativar sua propria conta"
            );
        }

        Funcionario funcionario = buscarAtivo(id);

        if(funcionarioRepository.countByUsuarioAtivoTrue() <= 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível desativar o último funcionário ativo."
            );
        }

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

    private void validar(Funcionario dados, boolean senhaObrigatoria) 
    {
        if(dados == null || dados.getUsuario() == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "dados obrigatorios nao foram informados"
            );
        }

        Usuario usuario = dados.getUsuario();

        validarCampos(usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                dados.getDataNascimento(),
                senhaObrigatoria
        );
    }

    private void validarCampos(
            String nome,
            String email,
            String senha,
            LocalDate dataNascimento,
            boolean senhaObrigatoria) 
            {
                if(nome == null || nome.trim().length() < 2 || nome.trim().length() > 150){
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "nome invalido."
                    );
                }

                if (email == null || email.trim().length() > 150 || !email.trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "e-mail invalido."
                    );
                }

                if (dataNascimento == null || dataNascimento.isAfter(LocalDate.now())) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "data de nascimento invalida."
                    );
                }

                if ((senhaObrigatoria && (senha == null || senha.isBlank())) || (senha != null && !senha.isBlank() && senha.length() < 8)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "minimo 8 caracteres para senha"
                    );
                }
            }

            @Transactional(readOnly = true)
            public void validarFuncionarioAutenticado(Integer usuarioId) {

                if (funcionarioRepository
                        .findByIdAndUsuarioAtivoTrue(usuarioId)
                        .isEmpty()) {

                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Acesso permitido apenas a funcionários ativos."
                    );
                }
            }
}
