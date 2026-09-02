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
            historico: [
                { dataHora: '19/08/2026 15:34', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '19/08/2026 17:02', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' }
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
