package br.com.projetoweb2.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import br.com.projetoweb2.service.LoginService;
import br.com.projetoweb2.DTO.LoginResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import br.com.projetoweb2.model.Solicitacao;
import br.com.projetoweb2.repository.SolicitacaoRepository;
import br.com.projetoweb2.DTO.RedirecionamentoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.DTO.StatusRequestDTO;
import br.com.projetoweb2.service.SolicitacaoService;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.repository.FuncionarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;


@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoREST {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitacaoService solicitacaoService;
    private final FuncionarioRepository funcionarioRepository;

    private final LoginService loginService;

    public SolicitacaoREST(SolicitacaoRepository solicitacaoRepository, SolicitacaoService solicitacaoService, FuncionarioRepository funcionarioRepository, LoginService loginService) {
        this.loginService = loginService;
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitacaoService = solicitacaoService;
        this.funcionarioRepository = funcionarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarTodos(HttpServletRequest request) {
        Integer funcionarioId = exigirFuncionarioAutenticado(request);
        return ResponseEntity.ok(solicitacaoService.listarTodos(funcionarioId));
    }   

    @GetMapping("/abertas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarAbertas(HttpServletRequest request) {
        exigirFuncionarioAutenticado(request);
        return ResponseEntity.ok(solicitacaoService.listarAbertas());
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarAtivas(HttpServletRequest request) {
        Integer funcionarioId = exigirFuncionarioAutenticado(request);
        return ResponseEntity.ok(solicitacaoService.listarAtivas(funcionarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(
            @PathVariable("id") int id, HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if ("CLIENTE".equals(usuario.perfil())) {
            return ResponseEntity.ok(solicitacaoService.buscar(id, usuario.id()));
        }
        Integer funcionarioId = exigirFuncionarioAutenticado(request);
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id, funcionarioId));
    }

    // RF013 - Solicitações visíveis ao funcionário
    @GetMapping("/visiveis/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarVisiveis(
            @PathVariable("funcionarioId") Integer funcionarioId, HttpServletRequest request) {
        Integer funcionarioLogadoId = exigirFuncionarioAutenticado(request);
        if (!funcionarioLogadoId.equals(funcionarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Funcionario diferente da sessao.");
        }
        return ResponseEntity.ok(
                solicitacaoService.listarVisiveis(funcionarioLogadoId)
        );
    }

    // Solicitações atribuídas ao funcionário
    @GetMapping("/atribuidas/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarAtribuidas(
            @PathVariable("funcionarioId") Integer funcionarioId, HttpServletRequest request) {
        Integer funcionarioLogadoId = exigirFuncionarioAutenticado(request);
        if (!funcionarioLogadoId.equals(funcionarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Funcionario diferente da sessao.");
        }
        return ResponseEntity.ok(
                solicitacaoService.listarAtribuidas(funcionarioLogadoId)
        );
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> inserir(@RequestBody SolicitacaoRequestDTO dados, HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if (!"CLIENTE".equals(usuario.perfil())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operacao exclusiva de cliente.");
        }
        if (dados == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados obrigatorios.");
        }
        if (!usuario.id().equals(dados.clienteId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cliente diferente da sessao.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.criar(dados));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Solicitacao> alterar(@PathVariable ("id") int id, @RequestBody Solicitacao dados, HttpServletRequest request) {
            Integer funcionarioId = exigirFuncionarioAutenticado(request);
            Solicitacao solicitacao = solicitacaoRepository.findById(id).orElse(null);

            if (solicitacao == null || !Boolean.TRUE.equals(solicitacao.getAtivo())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            exigirAlteracaoPermitida(solicitacao, funcionarioId);

            if(dados.getDescricaoEquipamento() == null || 
                dados.getDescricaoEquipamento().isBlank() || 
                dados.getDescricaoDefeito() == null || 
                dados.getDescricaoDefeito().isBlank() ){

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            solicitacao.setDescricaoEquipamento(dados.getDescricaoEquipamento().trim());

            solicitacao.setDescricaoDefeito(dados.getDescricaoDefeito().trim());

            solicitacaoRepository.save(solicitacao);

            return ResponseEntity.ok(solicitacao);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SolicitacaoResponseDTO> alterarStatus(@PathVariable ("id") int id, @RequestBody StatusRequestDTO dados, HttpServletRequest request) {
        Integer funcionarioId = exigirFuncionarioAutenticado(request);
        if (dados == null || dados.getFuncionarioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Funcionario obrigatorio.");
        }
        if (!funcionarioId.equals(dados.getFuncionarioId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Funcionario diferente da sessao.");
        }
        return ResponseEntity.ok(solicitacaoService.alterarStatus(id, dados));
    }

    @PutMapping("/{id}/redirecionar")
    @Transactional
    public ResponseEntity<SolicitacaoResponseDTO> redirecionar(@PathVariable ("id") int id, @RequestBody RedirecionamentoRequestDTO dados, HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if(session == null || !(session.getAttribute("usuarioId") instanceof Integer usuarioLogadoId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(dados == null || dados.getFuncionarioOrigemId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if(!usuarioLogadoId.equals(dados.getFuncionarioOrigemId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(solicitacaoService.redirecionar(id, dados));
    }

    @PutMapping("/{id}/orcamento/{funcionarioId}")
    @Transactional
    public ResponseEntity<Void> registrarOrcamento(
        @PathVariable("id") Integer id,
        @PathVariable("funcionarioId") Integer funcionarioId,
        @RequestBody Solicitacao dados, HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if(session == null || !(session.getAttribute("usuarioId") instanceof Integer usuarioLogadoId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if(!usuarioLogadoId.equals(funcionarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (id == null || id <= 0
                || funcionarioId == null || funcionarioId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        if (dados == null || dados.getValorOrcamento() == null) {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal valor = dados.getValorOrcamento();

        if (valor.compareTo(BigDecimal.ZERO) <= 0
                || valor.scale() > 2
                || valor.compareTo(new BigDecimal("99999999.99")) > 0) {
            return ResponseEntity.badRequest().build();
        }

        Solicitacao solicitacao = solicitacaoRepository
                .findById(id)
                .orElse(null);

        if (solicitacao == null
                || !Boolean.TRUE.equals(solicitacao.getAtivo())) {
            return ResponseEntity.notFound().build();
        }

        if (solicitacao.getStatus() != SolicitacaoStatus.ABERTA) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Funcionario funcionario = funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(funcionarioId)
                .orElse(null);

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        LocalDateTime agora = LocalDateTime.now();

        solicitacao.setValorOrcamento(valor);
        solicitacao.setDataHoraOrcamento(agora);
        solicitacao.setFuncionarioOrcamento(funcionario);
        solicitacao.setFuncionarioAtual(funcionario);
        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.ORCADA,
                agora,
                funcionario,
                funcionario,
                "Orçamento registrado."
        );
        
        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Solicitacao> desativar(@PathVariable("id") int id, HttpServletRequest request) {
        Integer funcionarioId = exigirFuncionarioAutenticado(request);
        
        Solicitacao solicitacao = solicitacaoRepository.findById(id).orElse(null);

        if(solicitacao == null || !Boolean.TRUE.equals(solicitacao.getAtivo())){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        exigirAlteracaoPermitida(solicitacao, funcionarioId);
        solicitacao.setAtivo(false);
        solicitacaoRepository.save(solicitacao);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    private void exigirAlteracaoPermitida(Solicitacao solicitacao, Integer funcionarioId) {
        if (solicitacao.getStatus() == SolicitacaoStatus.FINALIZADA) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solicitacao finalizada nao pode ser alterada.");
        }
        if (solicitacao.getStatus() != SolicitacaoStatus.ABERTA
                && (solicitacao.getFuncionarioAtual() == null
                    || !funcionarioId.equals(solicitacao.getFuncionarioAtual().getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solicitacao atribuida a outro funcionario.");
        }
    }

    private LoginResponseDTO exigirUsuarioAutenticado(HttpServletRequest request) {
        HttpSession sessao = request.getSession(false);
        if (sessao == null || !(sessao.getAttribute("usuarioId") instanceof Integer usuarioId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado.");
        }
        return loginService.buscarUsuarioAtivo(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessao invalida."));
    }

    private Integer exigirFuncionarioAutenticado(HttpServletRequest request) {
        var usuario = exigirUsuarioAutenticado(request);
        if (!"FUNCIONARIO".equals(usuario.perfil()) ||
                funcionarioRepository.findByIdAndUsuarioAtivoTrue(usuario.id()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operacao exclusiva de funcionario.");
        }
        return usuario.id();
    }
}
