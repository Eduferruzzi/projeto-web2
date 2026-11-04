package br.com.projetoweb2.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetoweb2.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    List<Funcionario> findAllByUsuarioAtivoTrue();

    Optional<Funcionario> findByIdAndUsuarioAtivoTrue(Integer id);
}
