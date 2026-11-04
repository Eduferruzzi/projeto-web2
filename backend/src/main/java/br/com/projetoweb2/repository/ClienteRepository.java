package br.com.projetoweb2.repository;

import br.com.projetoweb2.usuario.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    List<Cliente> findAllByUsuarioAtivoTrue();

    Optional<Cliente> findByIdAndUsuarioAtivoTrue(Integer id);

    boolean existsByCpf(String cpf);
}
