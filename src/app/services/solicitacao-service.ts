import { Injectable } from '@angular/core';
import { Solicitacao, EstadoSolicitacao } from '../models/Solicitacao';

// Dados em memoria enquanto a API (Spring Boot) nao esta integrada.
@Injectable({
    providedIn: 'root'
})

export class SolicitacaoService {
    private solicitacoes : Solicitacao[] = [
        {
            id: 1,
            dataHora: '20/08/2026 14:14',
            descricaoEquipamento: 'Notebook Samsung S20',
            categoria: 'Notebook',
            descricaoDefeito: 'Nao liga, apresenta apenas o led de carga piscando.',
            estado: 'ORCADA',
            cliente: 'Joao da Silva',
            valorOrcamento: 450.9,
            dataHoraOrcamento: '21/08/2026 09:30',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '20/08/2026 14:14', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '21/08/2026 09:30', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' }
            ]
        },
        {
            id: 2,
            dataHora: '19/08/2026 15:34',
            descricaoEquipamento: 'Impressora HP 2700',
            categoria: 'Impressora',
            descricaoDefeito: 'Puxa varias folhas de uma vez e trava.',
            estado: 'ORCADA',
            cliente: 'Joana Souza',
            valorOrcamento: 189.5,
            dataHoraOrcamento: '19/08/2026 17:02',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '19/08/2026 15:34', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '19/08/2026 17:02', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' }
            ]
        },
        {
            id: 3,
            dataHora: '18/08/2026 15:34',
            descricaoEquipamento: 'Desktop Dell Optiplex',
            categoria: 'Desktop',
            descricaoDefeito: 'Reinicia sozinho depois de alguns minutos ligado.',
            estado: 'APROVADA',
            cliente: 'Jose Pereira',
            valorOrcamento: 320,
            dataHoraOrcamento: '18/08/2026 16:10',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '18/08/2026 15:34', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '18/08/2026 16:10', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '18/08/2026 18:45', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null }
            ]
        },
        {
            id: 4,
            dataHora: '17/08/2026 09:12',
            descricaoEquipamento: 'Teclado mecanico Logitech',
            categoria: 'Teclado',
            descricaoDefeito: 'Algumas teclas nao respondem ao toque.',
            estado: 'REJEITADA',
            cliente: 'Joaquina Lima',
            valorOrcamento: 150,
            dataHoraOrcamento: '17/08/2026 11:00',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: 'Valor proximo ao de um teclado novo.',
            dataHoraPagamento: null,
            historico: [
                { dataHora: '17/08/2026 09:12', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '17/08/2026 11:00', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' },
                {
                    dataHora: '17/08/2026 14:20',
                    estadoAnterior: 'ORCADA',
                    estadoNovo: 'REJEITADA',
                    funcionario: null,
                    observacao: 'Valor proximo ao de um teclado novo.'
                }
            ]
        },
        {
            id: 5,
            dataHora: '16/08/2026 08:40',
            descricaoEquipamento: 'Notebook Lenovo Ideapad',
            categoria: 'Notebook',
            descricaoDefeito: 'Superaquece e desliga durante o uso.',
            estado: 'ARRUMADA',
            cliente: 'Joao da Silva',
            valorOrcamento: 275.4,
            dataHoraOrcamento: '16/08/2026 10:15',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '16/08/2026 08:40', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '16/08/2026 10:15', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '16/08/2026 13:05', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '17/08/2026 16:30',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Mario',
                    observacao: 'Troca da pasta termica e limpeza do cooler.'
                }
            ]
        }
    ];

    buscarPorId(id : number) : Solicitacao | undefined {
        return this.solicitacoes.find(solicitacao => solicitacao.id === id);
    }

    listar() : Solicitacao[] {
        return this.solicitacoes;
    }

    // RF006 - Aprovar Servico
    aprovar(id : number) {
        this.alterarEstado(id, 'APROVADA');
    }

    // RF007 - Rejeitar Servico
    rejeitar(id : number, motivo : string) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) {
            return;
        }
        solicitacao.motivoRejeicao = motivo;
        this.alterarEstado(id, 'REJEITADA', motivo);
    }

    // RF010 - Pagar Servico: registra a data/hora do pagamento
    pagar(id : number) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao || solicitacao.estado !== 'ARRUMADA') {
            return;
        }
        solicitacao.dataHoraPagamento = new Date().toLocaleString('pt-BR');
        this.alterarEstado(id, 'PAGA', `Pagamento confirmado em ${solicitacao.dataHoraPagamento}.`);
    }

    private alterarEstado(id : number, novoEstado : EstadoSolicitacao, observacao? : string) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) {
            return;
        }
        solicitacao.historico.push({
            dataHora: new Date().toLocaleString('pt-BR'),
            estadoAnterior: solicitacao.estado,
            estadoNovo: novoEstado,
            funcionario: null,
            observacao: observacao
        });
        solicitacao.estado = novoEstado;
    }

    // RF 011 - Somente solicitacoes em aberto
    listarAbertas() : Solicitacao[]{
        return this.solicitacoes.filter(s => s.estado == "ABERTA");
    }

    // RF 012 Efetuar o orcamento 
    efetuarOrcamento(id : number, valor : number, funcionario : string){
        const solicitacao = this.buscarPorId(id);
        if(!solicitacao){
            return;
        }
        solicitacao.valorOrcamento = valor;
        solicitacao.dataHoraOrcamento = new Date().toLocaleDateString('pt-BR');
        solicitacao.funcionarioOrcamento = funcionario;
        this.alterarEstado(id, "ORCADA");

    }
}
