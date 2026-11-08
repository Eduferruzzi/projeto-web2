package br.com.projetoweb2.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.projetoweb2.model.CategoriaEquipamento;

public interface CategoriaEquipamentoRepository extends JpaRepository<CategoriaEquipamento, Integer> {
    List<CategoriaEquipamento> findByAtivoTrue();
}
