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
    funcionario : string | null;
    observacao? : string;
}

export interface Solicitacao {
    id : number;
    dataHora : string;
    descricaoEquipamento : string;
    categoria : string;
    descricaoDefeito : string;
    estado : EstadoSolicitacao;
    cliente : string;
    valorOrcamento : number | null;
    dataHoraOrcamento : string | null;
    funcionarioOrcamento : string | null;
    motivoRejeicao : string | null;
    historico : HistoricoSolicitacao[];
}
