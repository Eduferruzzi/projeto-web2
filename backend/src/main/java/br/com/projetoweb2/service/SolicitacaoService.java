package br.com.projetoweb2.service;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import br.com.projetoweb2.DTO.RedirecionamentoRequestDTO;
import br.com.projetoweb2.DTO.RejeicaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoRequestDTO;
import br.com.projetoweb2.DTO.SolicitacaoResponseDTO;
import br.com.projetoweb2.DTO.StatusRequestDTO;
import br.com.projetoweb2.enums.SolicitacaoStatus;
import br.com.projetoweb2.model.Funcionario;
import br.com.projetoweb2.model.Solicitacao;
import br.com.projetoweb2.repository.SolicitacaoRepository;
import br.com.projetoweb2.repository.ClienteRepository;
import br.com.projetoweb2.repository.FuncionarioRepository;
import br.com.projetoweb2.repository.CategoriaEquipamentoRepository;

@Service
public class SolicitacaoService {

    private static final int TAMANHO_MINIMO_MOTIVO = 5;

    private final SolicitacaoRepository solicitacaoRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaEquipamentoRepository categoriaRepository;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
            ClienteRepository clienteRepository, FuncionarioRepository funcionarioRepository, CategoriaEquipamentoRepository categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodos(Integer funcionarioId) {
        exigirFuncionarioAtivo(funcionarioId);
        return solicitacaoRepository.findAll()
                .stream()
                .filter(solicitacao -> podeVisualizar(solicitacao, funcionarioId))
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarReceitas(Integer funcionarioId) {
        exigirFuncionarioAtivo(funcionarioId);
        return solicitacaoRepository.findAll()
                .stream()
                .filter(solicitacao -> solicitacao.getDataHoraPagamento() != null)
                .filter(solicitacao -> solicitacao.getStatus() == SolicitacaoStatus.PAGA
                        || solicitacao.getStatus() == SolicitacaoStatus.FINALIZADA)
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarAbertas() {
        return solicitacaoRepository
                .findByAtivoTrueAndStatus(SolicitacaoStatus.ABERTA)
                .stream()
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarAtivas(Integer funcionarioId) {
        exigirFuncionarioAtivo(funcionarioId);
        return solicitacaoRepository
                .findByAtivoTrueOrderByDataHoraAberturaAsc()
                .stream()
                .filter(solicitacao -> podeVisualizar(solicitacao, funcionarioId))
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarVisiveis(Integer funcionarioId) {

        exigirFuncionarioAtivo(funcionarioId);

        return solicitacaoRepository
                .listarVisiveisFuncionario(
                        funcionarioId,
                        List.of(SolicitacaoStatus.ABERTA, SolicitacaoStatus.FINALIZADA)
                )
                .stream()
                .filter(solicitacao -> podeVisualizar(solicitacao, funcionarioId))
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarAtribuidas(Integer funcionarioId) {

        exigirFuncionarioAtivo(funcionarioId);

        return solicitacaoRepository
                .listarAtribuidasFuncionario(funcionarioId)
                .stream()
                .map(SolicitacaoResponseDTO::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(Integer id, Integer funcionarioId) {
        exigirFuncionarioAtivo(funcionarioId);
        Solicitacao solicitacao = solicitacaoRepository.buscarComHistorico(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitacao nao encontrada."));
        if (!podeVisualizar(solicitacao, funcionarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solicitacao atribuida a outro funcionario.");
        }
        return SolicitacaoResponseDTO.de(solicitacao);
    }

    private boolean podeVisualizar(Solicitacao solicitacao, Integer funcionarioId) {
        return solicitacao.getStatus() == SolicitacaoStatus.ABERTA
                || solicitacao.getStatus() == SolicitacaoStatus.FINALIZADA
                || (solicitacao.getFuncionarioAtual() != null
                    && funcionarioId.equals(solicitacao.getFuncionarioAtual().getId()));
    }

    @Transactional
    public SolicitacaoResponseDTO criar(SolicitacaoRequestDTO dados) {
        validarCadastro(dados);

        var cliente = clienteRepository.findByIdAndUsuarioAtivoTrue(dados.clienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente não encontrado."));
        var categoria = categoriaRepository.findById(dados.categoriaId())
                .filter(c -> Boolean.TRUE.equals(c.getAtivo()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada ou inativa."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricaoEquipamento(dados.descricaoEquipamento().trim());
        solicitacao.setDescricaoDefeito(dados.descricaoDefeito().trim());
        solicitacao.setDataHoraAbertura(LocalDateTime.now());
        solicitacao.setStatus(SolicitacaoStatus.ABERTA);
        solicitacao.setAtivo(true);
        solicitacao.registrarMudancaDeEstado(SolicitacaoStatus.ABERTA, LocalDateTime.now(), null, null, "Solicitacao aberta.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    private void validarCadastro(SolicitacaoRequestDTO dados) {
        if (dados == null || dados.clienteId() == null || dados.clienteId() <= 0
                || dados.categoriaId() == null || dados.categoriaId() <= 0
                || dados.descricaoEquipamento() == null || dados.descricaoEquipamento().isBlank()
                || dados.descricaoDefeito() == null || dados.descricaoDefeito().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha todos os campos obrigatórios.");
        }
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscar(Integer id, Integer clienteId) {
        return SolicitacaoResponseDTO.de(buscarDoCliente(id, clienteId));
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorCliente(Integer clienteId) {
        if (clienteId == null || clienteId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente nao informado.");
        }
        return solicitacaoRepository.listarPorCliente(clienteId)
                .stream()
                .map(SolicitacaoResponseDTO::de)
                .sorted(Comparator.comparing(
                        SolicitacaoResponseDTO::dataHora,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    @Transactional
    public SolicitacaoResponseDTO aprovar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ORCADA,
                "Somente uma solicitacao orcada pode ser aprovada.");

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.APROVADA,
                LocalDateTime.now(),
                solicitacao.getFuncionarioAtual(),
                solicitacao.getFuncionarioAtual(),
                "Orcamento aprovado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO rejeitar(Integer id, Integer clienteId, RejeicaoRequestDTO dados) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ORCADA,
                "Somente uma solicitacao orcada pode ser rejeitada.");

        String motivo = validarMotivo(dados);
        solicitacao.setMotivoRejeicao(motivo);

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.REJEITADA,
                LocalDateTime.now(),
                null,
                null,
                motivo);

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO resgatar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.REJEITADA,
                "Somente uma solicitacao rejeitada pode ser resgatada.");

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.APROVADA,
                LocalDateTime.now(),
                null,
                null,
                "Servico resgatado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponseDTO pagar(Integer id, Integer clienteId) {
        Solicitacao solicitacao = buscarDoCliente(id, clienteId);
        exigirEstado(solicitacao, SolicitacaoStatus.ARRUMADA,
                "Somente uma solicitacao arrumada pode ser paga.");

        LocalDateTime agora = LocalDateTime.now();
        solicitacao.setDataHoraPagamento(agora);

        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.PAGA,
                agora,
                null,
                null,
                "Pagamento confirmado pelo cliente.");

        return SolicitacaoResponseDTO.de(solicitacaoRepository.save(solicitacao));
    }

    private Solicitacao buscarDoCliente(Integer id, Integer clienteId) {
        if (clienteId == null || clienteId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente nao informado.");
        }

        Solicitacao solicitacao = solicitacaoRepository.buscarComHistorico(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Solicitacao nao encontrada."));

        if (!Boolean.TRUE.equals(solicitacao.getAtivo())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Solicitacao nao encontrada.");
        }

        if (!solicitacao.getCliente().getId().equals(clienteId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Esta solicitacao pertence a outro cliente.");
        }

        return solicitacao;
    }

    @Transactional
    public SolicitacaoResponseDTO alterarStatus(
            int solicitacaoId,
            StatusRequestDTO dados) {

        // Validar dados recebidos
        if (solicitacaoId <= 0
                || dados == null
                || dados.getFuncionarioId() == null
                || dados.getFuncionarioId() <= 0
                || dados.getStatus() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dados da solicitação inválidos.");
        }

        // Buscar solicitação ativa
        Solicitacao solicitacao = solicitacaoRepository
                .findById(solicitacaoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."));

        if (!Boolean.TRUE.equals(solicitacao.getAtivo())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação inativa.");
        }

        // Buscar funcionário ativo
        Funcionario funcionario = funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(dados.getFuncionarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Funcionário não encontrado ou inativo."));

        LocalDateTime agora = LocalDateTime.now();

        // Concluir manutenção
        if ("ARRUMADA".equals(dados.getStatus())) {

            if (solicitacao.getStatus() != SolicitacaoStatus.APROVADA
                    && solicitacao.getStatus() != SolicitacaoStatus.REDIRECIONADA) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "A solicitação não está disponível para manutenção.");
            }

            Funcionario atual = solicitacao.getFuncionarioAtual();

            if (atual == null
                    || !atual.getId().equals(funcionario.getId())) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "A manutenção pertence a outro funcionário.");
            }

            if (dados.getObservacao() == null
                    || dados.getObservacao().isBlank()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Informe os detalhes da manutenção.");
            }

            if (dados.getDescricaoManutencao() == null
                    || dados.getDescricaoManutencao().isBlank()
                    || dados.getOrientacoesCliente() == null
                    || dados.getOrientacoesCliente().isBlank()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Informe a descrição da manutenção e as orientações ao cliente.");
            }

            solicitacao.setFuncionarioResponsavel(funcionario);
            solicitacao.setDataHoraManutencao(agora);
            solicitacao.setDescricaoManutencao(dados.getDescricaoManutencao().trim());
            solicitacao.setOrientacoesCliente(dados.getOrientacoesCliente().trim());

            solicitacao.registrarMudancaDeEstado(
                    SolicitacaoStatus.ARRUMADA,
                    agora,
                    funcionario,
                    null,
                    dados.getObservacao().trim()
            );

        // Finalizar solicitação
        } else if ("FINALIZADA".equals(dados.getStatus())) {

            if (solicitacao.getStatus() != SolicitacaoStatus.PAGA) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Somente solicitações pagas podem ser finalizadas.");
            }

            Funcionario atual = solicitacao.getFuncionarioAtual();
            if (atual == null || !funcionario.getId().equals(atual.getId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Somente o funcionario responsavel pode finalizar a solicitacao.");
            }

            solicitacao.setFuncionarioFinalizacao(funcionario);
            solicitacao.setDataHoraFinalizacao(agora);

            solicitacao.registrarMudancaDeEstado(
                    SolicitacaoStatus.FINALIZADA,
                    agora,
                    funcionario,
                    null,
                    "Solicitação finalizada."
            );

        } else {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Alteração de estado não permitida por este endpoint.");
        }

        return SolicitacaoResponseDTO.de(
                solicitacaoRepository.save(solicitacao)
        );
    }
    
    @Transactional
    public SolicitacaoResponseDTO redirecionar(
            int solicitacaoId,
            RedirecionamentoRequestDTO dados) {

        // Validar dados
        if (solicitacaoId <= 0
                || dados == null
                || dados.getFuncionarioOrigemId() == null
                || dados.getFuncionarioDestinoId() == null
                || dados.getFuncionarioOrigemId() <= 0
                || dados.getFuncionarioDestinoId() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe os funcionários de origem e destino.");
        }

        Integer origemId = dados.getFuncionarioOrigemId();
        Integer destinoId = dados.getFuncionarioDestinoId();

        // Impedir redirecionamento para si mesmo
        if (origemId.equals(destinoId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Não é permitido redirecionar para si mesmo.");
        }

        // Buscar solicitação
        Solicitacao solicitacao = solicitacaoRepository
                .findById(solicitacaoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitação não encontrada."));

        if (!Boolean.TRUE.equals(solicitacao.getAtivo())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Solicitação inativa.");
        }

        // Verificar estado
        if (solicitacao.getStatus() != SolicitacaoStatus.APROVADA
                && solicitacao.getStatus() != SolicitacaoStatus.REDIRECIONADA) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A solicitação não pode ser redirecionada neste estado.");
        }

        // Buscar funcionários ativos
        Funcionario origem = funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(origemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Funcionário de origem não encontrado ou inativo."));

        Funcionario destino = funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(destinoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Funcionário de destino não encontrado ou inativo."));

        // Verificar funcionário responsável atual
        Funcionario atual = solicitacao.getFuncionarioAtual();

        if (atual == null || !atual.getId().equals(origem.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Somente o funcionário responsável pode redirecionar.");
        }

        // Atualizar destino
        solicitacao.setFuncionarioAtual(destino);

        // Registrar histórico
        solicitacao.registrarMudancaDeEstado(
                SolicitacaoStatus.REDIRECIONADA,
                LocalDateTime.now(),
                origem,
                destino,
                "Solicitação redirecionada de "
                        + origem.getUsuario().getNome()
                        + " para "
                        + destino.getUsuario().getNome() + "."
        );

        return SolicitacaoResponseDTO.de(
                solicitacaoRepository.save(solicitacao)
        );
    }

        // Verifica se a solicitação está no estado esperado
    private void exigirEstado(
            Solicitacao solicitacao,
            SolicitacaoStatus esperado,
            String mensagem) {

        if (solicitacao.getStatus() != esperado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    mensagem + " Estado atual: "
                            + solicitacao.getStatus().name() + "."
            );
        }
    }

    // Valida o motivo informado pelo cliente ao rejeitar orçamento
    private String validarMotivo(RejeicaoRequestDTO dados) {

        if (dados == null
                || dados.motivo() == null
                || dados.motivo().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Informe o motivo da rejeicao."
            );
        }

        String motivo = dados.motivo().trim();

        if (motivo.length() < TAMANHO_MINIMO_MOTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O motivo deve ter pelo menos "
                            + TAMANHO_MINIMO_MOTIVO
                            + " caracteres."
            );
        }

        return motivo;
    }

    private void exigirFuncionarioAtivo(Integer funcionarioId) {

        if (funcionarioId == null || funcionarioId <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Identificador do funcionário inválido."
            );
        }

        funcionarioRepository
                .findByIdAndUsuarioAtivoTrue(funcionarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Funcionário não encontrado ou inativo."
                ));
    }
}
