package br.com.projetoweb2.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetoweb2.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmailIgnoreCaseAndAtivoTrue(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Integer id);
}
