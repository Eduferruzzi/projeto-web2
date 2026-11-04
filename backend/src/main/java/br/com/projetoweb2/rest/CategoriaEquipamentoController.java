package br.com.projetoweb2.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetoweb2.model.CategoriaEquipamento;
import br.com.projetoweb2.repository.CategoriaEquipamentoRepository;

@CrossOrigin
@RestController
@RequestMapping("/api/categorias")
public class CategoriaEquipamentoController {

    private final CategoriaEquipamentoRepository repository;

    public CategoriaEquipamentoController(CategoriaEquipamentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CategoriaEquipamento> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEquipamento> buscarPorId(@PathVariable("id") Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaEquipamento> inserir(@RequestBody CategoriaEquipamento categoria) {
        categoria.setId(null);
        categoria.setAtivo(true);

        CategoriaEquipamento novaCategoria = repository.save(categoria);

        return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria);
    }
}
