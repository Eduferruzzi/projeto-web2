export type EstadoSolicitacao =
    | 'ABERTA'
    | 'ORCADA'
    | 'APROVADA'
    | 'REJEITADA'
    | 'REDIRECIONADA'
    | 'ARRUMADA'
    | 'PAGA'
    | 'FINALIZADA';

export interface HistoricoSolicitacao {
    dataHora : string;
    estadoAnterior : EstadoSolicitacao | null;
    estadoNovo : EstadoSolicitacao;
    funcionarioOrigem : string | null;
    funcionarioDestino : string | null;
    observacao? : string;
}

export interface Solicitacao {
    id : number;
    dataHora : string;
    descricaoEquipamento : string;
    categoria : string;
    descricaoDefeito : string;
    estado : EstadoSolicitacao;
    clienteId : number | null;
    cliente : string | null;
    valorOrcamento : number | null;
    dataHoraOrcamento : string | null;
    funcionarioOrcamento : string | null;
    motivoRejeicao : string | null;
    dataHoraPagamento : string | null;
    historico : HistoricoSolicitacao[];
    funcionarioResponsavel : string | null;
    funcionarioRedirecionado : string | null;
    descricaoManutencao: string | null;
    orientacoesCliente: string | null;
    dataHoraFinalizacao: string | null;
}
