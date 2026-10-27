package br.com.projetoweb2.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.Usuario;
import br.com.projetoweb2.repository.FuncionarioRepository;
import br.com.projetoweb2.repository.UsuarioRepository;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioREST {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public FuncionarioREST(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Funcionario> listar() {
        return funcionarioRepository.findAllByUsuarioAtivoTrue()
                .stream()
                .toList();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Funcionario> criar(@RequestBody Funcionario funcionario) {
        validar(funcionario, true);
        Usuario usuario = funcionario.getUsuario();
        String email = usuario.getEmail().trim();
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com este e-mail.");
        }

        usuario.setId(null);
        usuario.setNome(usuario.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setPerfil("FUNCIONARIO");
        usuario.setAtivo(true);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(funcionarioRepository.save(funcionario));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Funcionario> atualizar(
            @PathVariable Integer id,
            @RequestBody Funcionario dadosAtualizados) {
        validar(dadosAtualizados, false);
        Funcionario funcionario = funcionarioRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Usuario usuarioRecebido = dadosAtualizados.getUsuario();
        String email = usuarioRecebido.getEmail().trim();
        if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um usuário com este e-mail.");
        }

        Usuario usuario = funcionario.getUsuario();
        usuario.setNome(usuarioRecebido.getNome().trim());
        usuario.setEmail(email);
        if (usuarioRecebido.getSenha() != null && !usuarioRecebido.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(usuarioRecebido.getSenha()));
        }
        funcionario.setDataNascimento(dadosAtualizados.getDataNascimento());
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(funcionarioRepository.save(funcionario));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> desativar(@PathVariable Integer id) {
        Funcionario funcionario = funcionarioRepository.findByIdAndUsuarioAtivoTrue(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        funcionario.getUsuario().setAtivo(false);
        usuarioRepository.save(funcionario.getUsuario());
        return ResponseEntity.noContent().build();
    }

    private void validar(Funcionario funcionario, boolean senhaObrigatoria) {
        if (funcionario == null
                || funcionario.getUsuario() == null
                || funcionario.getUsuario().getNome() == null || funcionario.getUsuario().getNome().isBlank()
                || funcionario.getUsuario().getEmail() == null || funcionario.getUsuario().getEmail().isBlank()
                || funcionario.getDataNascimento() == null
                || (senhaObrigatoria && (funcionario.getUsuario().getSenha() == null
                        || funcionario.getUsuario().getSenha().isBlank()))
                || (funcionario.getUsuario().getSenha() != null
                        && !funcionario.getUsuario().getSenha().isBlank()
                        && funcionario.getUsuario().getSenha().length() < 4)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados do funcionário inválidos.");
        }
    }
}
