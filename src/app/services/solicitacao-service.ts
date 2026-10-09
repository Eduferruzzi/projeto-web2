import { Injectable } from '@angular/core';
import { Solicitacao, EstadoSolicitacao } from '../models/Solicitacao';
import { dataHoraAtual } from '../shared';

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
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
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
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
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
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
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
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
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
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },{
            id: 6,
            dataHora: '22/08/2026 10:00',
            descricaoEquipamento: 'Celular Motorola Edge 40',
            categoria: 'Celular',
            descricaoDefeito: 'Tela quebrada, nao liga a tela mas o aparelho funciona.',
            estado: 'ABERTA',
            cliente: 'Carlos Pereira',
            valorOrcamento: null,
            dataHoraOrcamento: null,
            funcionarioOrcamento: null,
            motivoRejeicao: null,
            historico: [
                { dataHora: '22/08/2026 10:00', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null }
            ],
            dataHoraPagamento: null,
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 7,
            dataHora: '15/09/2026 09:20',
            descricaoEquipamento: 'Notebook Acer Aspire 5',
            categoria: 'Notebook',
            descricaoDefeito: 'Bateria nao carrega e o equipamento desliga fora da tomada.',
            estado: 'PAGA',
            cliente: 'Ana Martins',
            valorOrcamento: 280,
            dataHoraOrcamento: '15/09/2026 10:00',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: '15/09/2026 14:30',
            historico: [
                { dataHora: '15/09/2026 09:20', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '15/09/2026 10:00', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '15/09/2026 11:15', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                { dataHora: '15/09/2026 13:40', estadoAnterior: 'APROVADA', estadoNovo: 'ARRUMADA', funcionario: 'Temporario' },
                { dataHora: '15/09/2026 14:30', estadoAnterior: 'ARRUMADA', estadoNovo: 'PAGA', funcionario: null }
            ],
            funcionarioResponsavel: 'Temporario',
            funcionarioRedirecionado: null
        },
        {
            id: 8,
            dataHora: '15/09/2026 08:45',
            descricaoEquipamento: 'Impressora Epson EcoTank',
            categoria: 'Impressora',
            descricaoDefeito: 'Imprime com falhas e apresenta manchas nas folhas.',
            estado: 'REDIRECIONADA',
            cliente: 'Bruno Alves',
            valorOrcamento: 195,
            dataHoraOrcamento: '15/09/2026 09:30',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '15/09/2026 08:45', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '15/09/2026 09:30', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '15/09/2026 10:20', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                { dataHora: '15/09/2026 11:00', estadoAnterior: 'APROVADA', estadoNovo: 'REDIRECIONADA', funcionario: 'Maria', observacao: 'Solicitacao redirecionada para outro funcionario.' }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: 'Temporario'
        },
        {
            id: 9,
            dataHora: '16/09/2026 10:45',
            descricaoEquipamento: 'Impressora HP',
            categoria: 'Impressora',
            descricaoDefeito: 'Imprime com falhas e apresenta manchas nas folhas.',
            estado: 'FINALIZADA',
            cliente: 'Bruno Alves',
            valorOrcamento: 195,
            dataHoraOrcamento: '15/09/2026 09:30',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '15/09/2026 08:45', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '15/09/2026 09:30', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '15/09/2026 10:20', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                { dataHora: '15/09/2026 11:00', estadoAnterior: 'APROVADA', estadoNovo: 'REDIRECIONADA', funcionario: 'Maria', observacao: 'Solicitacao redirecionada para outro funcionario.' }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: 'Temporario'
        },
        {
            id: 10,
            dataHora: '18/09/2026 07:50',
            descricaoEquipamento: 'Tablet Samsung Galaxy Tab',
            categoria: 'Tablet',
            descricaoDefeito: 'Nao reconhece o carregador e desliga apos poucos minutos.',
            estado: 'ABERTA',
            cliente: 'Mariana Costa',
            valorOrcamento: null,
            dataHoraOrcamento: null,
            funcionarioOrcamento: null,
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '18/09/2026 07:50', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 11,
            dataHora: '21/09/2026 13:25',
            descricaoEquipamento: 'Monitor LG Ultrawide',
            categoria: 'Monitor',
            descricaoDefeito: 'Apresenta linhas horizontais e oscila a imagem.',
            estado: 'ORCADA',
            cliente: 'Rafael Mendes',
            valorOrcamento: 410,
            dataHoraOrcamento: '21/09/2026 15:10',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '21/09/2026 13:25', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '21/09/2026 15:10', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 12,
            dataHora: '24/09/2026 08:15',
            descricaoEquipamento: 'Console PlayStation 5',
            categoria: 'Console',
            descricaoDefeito: 'Superaquece e desliga durante os jogos.',
            estado: 'APROVADA',
            cliente: 'Lucas Oliveira',
            valorOrcamento: 360,
            dataHoraOrcamento: '24/09/2026 09:00',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '24/09/2026 08:15', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '24/09/2026 09:00', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '24/09/2026 10:30', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 13,
            dataHora: '27/09/2026 16:40',
            descricaoEquipamento: 'Smartphone Xiaomi Redmi Note 12',
            categoria: 'Celular',
            descricaoDefeito: 'Microfone falha durante chamadas e gravacoes.',
            estado: 'ARRUMADA',
            cliente: 'Beatriz Nunes',
            valorOrcamento: 145,
            dataHoraOrcamento: '27/09/2026 17:20',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '27/09/2026 16:40', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '27/09/2026 17:20', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' },
                { dataHora: '27/09/2026 18:00', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                { dataHora: '28/09/2026 11:45', estadoAnterior: 'APROVADA', estadoNovo: 'ARRUMADA', funcionario: 'Temporario' }
            ],
            funcionarioResponsavel: 'Temporario',
            funcionarioRedirecionado: null
        },
        {
            id: 14,
            dataHora: '03/08/2026 08:20',
            descricaoEquipamento: 'Mouse Logitech MX Master 3',
            categoria: 'Mouse',
            descricaoDefeito: 'Scroll trava e o clique esquerdo repete sozinho.',
            estado: 'ABERTA',
            cliente: 'Joaquina Lima',
            valorOrcamento: null,
            dataHoraOrcamento: null,
            funcionarioOrcamento: null,
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '03/08/2026 08:20', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 15,
            dataHora: '13/08/2026 17:45',
            descricaoEquipamento: 'Mouse Razer DeathAdder',
            categoria: 'Mouse',
            descricaoDefeito: 'Botao lateral sem resposta.',
            estado: 'REJEITADA',
            cliente: 'Joao da Silva',
            valorOrcamento: 120,
            dataHoraOrcamento: '14/08/2026 10:20',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: 'Vou tentar o reparo na garantia do fabricante.',
            dataHoraPagamento: null,
            historico: [
                { dataHora: '13/08/2026 17:45', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '14/08/2026 10:20', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                {
                    dataHora: '14/08/2026 16:55',
                    estadoAnterior: 'ORCADA',
                    estadoNovo: 'REJEITADA',
                    funcionario: null,
                    observacao: 'Vou tentar o reparo na garantia do fabricante.'
                }
            ],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        },
        {
            id: 16,
            dataHora: '24/08/2026 09:50',
            descricaoEquipamento: 'Teclado Logitech K380',
            categoria: 'Teclado',
            descricaoDefeito: 'Nao pareia por bluetooth com nenhum aparelho.',
            estado: 'ARRUMADA',
            cliente: 'Jose Pereira',
            valorOrcamento: 95,
            dataHoraOrcamento: '24/08/2026 11:30',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [
                { dataHora: '24/08/2026 09:50', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '24/08/2026 11:30', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '24/08/2026 17:15', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '25/08/2026 10:40',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Maria',
                    observacao: 'Troca do modulo bluetooth e atualizacao do firmware.'
                }
            ],
            funcionarioResponsavel: 'Maria',
            funcionarioRedirecionado: null
        },
        {
            id: 17,
            dataHora: '01/09/2026 10:15',
            descricaoEquipamento: 'Notebook Acer Aspire 5',
            categoria: 'Notebook',
            descricaoDefeito: 'Bateria nao carrega acima de vinte por cento.',
            estado: 'PAGA',
            cliente: 'Joana Souza',
            valorOrcamento: 380,
            dataHoraOrcamento: '01/09/2026 13:25',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: '04/09/2026 09:30',
            historico: [
                { dataHora: '01/09/2026 10:15', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '01/09/2026 13:25', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '02/09/2026 08:40', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '03/09/2026 15:10',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Maria',
                    observacao: 'Substituicao da bateria e calibracao do controlador de carga.'
                },
                {
                    dataHora: '04/09/2026 09:30',
                    estadoAnterior: 'ARRUMADA',
                    estadoNovo: 'PAGA',
                    funcionario: null,
                    observacao: 'Pagamento confirmado em 04/09/2026 09:30.'
                }
            ],
            funcionarioResponsavel: 'Maria',
            funcionarioRedirecionado: null
        },
        {
            id: 18,
            dataHora: '08/09/2026 11:00',
            descricaoEquipamento: 'Desktop Positivo Master',
            categoria: 'Desktop',
            descricaoDefeito: 'Nao da video na inicializacao, apenas bipes.',
            estado: 'FINALIZADA',
            cliente: 'Joao da Silva',
            valorOrcamento: 410,
            dataHoraOrcamento: '08/09/2026 14:20',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: null,
            dataHoraPagamento: '11/09/2026 16:45',
            historico: [
                { dataHora: '08/09/2026 11:00', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '08/09/2026 14:20', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' },
                { dataHora: '09/09/2026 09:05', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '10/09/2026 14:30',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Mario',
                    observacao: 'Troca dos modulos de memoria e limpeza dos contatos.'
                },
                {
                    dataHora: '11/09/2026 16:45',
                    estadoAnterior: 'ARRUMADA',
                    estadoNovo: 'PAGA',
                    funcionario: null,
                    observacao: 'Pagamento confirmado em 11/09/2026 16:45.'
                },
                {
                    dataHora: '12/09/2026 08:15',
                    estadoAnterior: 'PAGA',
                    estadoNovo: 'FINALIZADA',
                    funcionario: 'Mario',
                    observacao: 'Equipamento entregue ao cliente.'
                }
            ],
            funcionarioResponsavel: 'Mario',
            funcionarioRedirecionado: null
        },
        {
            id: 19,
            dataHora: '15/09/2026 15:25',
            descricaoEquipamento: 'Impressora Brother DCP-1617',
            categoria: 'Impressora',
            descricaoDefeito: 'Atola papel na bandeja a cada duas paginas.',
            estado: 'FINALIZADA',
            cliente: 'Joaquina Lima',
            valorOrcamento: 175,
            dataHoraOrcamento: '16/09/2026 09:05',
            funcionarioOrcamento: 'Mario',
            motivoRejeicao: null,
            dataHoraPagamento: '18/09/2026 11:20',
            historico: [
                { dataHora: '15/09/2026 15:25', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '16/09/2026 09:05', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Mario' },
                { dataHora: '16/09/2026 14:50', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '17/09/2026 10:35',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Maria',
                    observacao: 'Troca do rolete de tracao e limpeza do caminho do papel.'
                },
                {
                    dataHora: '18/09/2026 11:20',
                    estadoAnterior: 'ARRUMADA',
                    estadoNovo: 'PAGA',
                    funcionario: null,
                    observacao: 'Pagamento confirmado em 18/09/2026 11:20.'
                },
                {
                    dataHora: '18/09/2026 17:00',
                    estadoAnterior: 'PAGA',
                    estadoNovo: 'FINALIZADA',
                    funcionario: 'Maria',
                    observacao: 'Equipamento retirado pela cliente.'
                }
            ],
            funcionarioResponsavel: 'Maria',
            funcionarioRedirecionado: null
        },
        {
            id: 20,
            dataHora: '22/09/2026 08:40',
            descricaoEquipamento: 'Mouse Dell MS116',
            categoria: 'Mouse',
            descricaoDefeito: 'Clique duplo involuntario em um clique simples.',
            estado: 'PAGA',
            cliente: 'Jose Pereira',
            valorOrcamento: 70,
            dataHoraOrcamento: '22/09/2026 10:15',
            funcionarioOrcamento: 'Maria',
            motivoRejeicao: null,
            dataHoraPagamento: '24/09/2026 14:05',
            historico: [
                { dataHora: '22/09/2026 08:40', estadoAnterior: null, estadoNovo: 'ABERTA', funcionario: null },
                { dataHora: '22/09/2026 10:15', estadoAnterior: 'ABERTA', estadoNovo: 'ORCADA', funcionario: 'Maria' },
                { dataHora: '22/09/2026 16:30', estadoAnterior: 'ORCADA', estadoNovo: 'APROVADA', funcionario: null },
                {
                    dataHora: '23/09/2026 13:50',
                    estadoAnterior: 'APROVADA',
                    estadoNovo: 'ARRUMADA',
                    funcionario: 'Maria',
                    observacao: 'Troca do switch do botao esquerdo.'
                },
                {
                    dataHora: '24/09/2026 14:05',
                    estadoAnterior: 'ARRUMADA',
                    estadoNovo: 'PAGA',
                    funcionario: null,
                    observacao: 'Pagamento confirmado em 24/09/2026 14:05.'
                }
            ],
            funcionarioResponsavel: 'Maria',
            funcionarioRedirecionado: null
        },
    ];

    buscarPorId(id : number) : Solicitacao | undefined {
        return this.solicitacoes.find(solicitacao => solicitacao.id === id);
    }

    listar() : Solicitacao[] {
        return this.solicitacoes;
    }

    cadastrar(
        descricaoEquipamento: string,
        categoria: string,
        descricaoDefeito: string
    ): Solicitacao {
        const dataHora = dataHoraAtual();
        const proximoId = Math.max(...this.solicitacoes.map(s => s.id), 0) + 1;

        const solicitacao: Solicitacao = {
            id: proximoId,
            dataHora,
            descricaoEquipamento,
            categoria,
            descricaoDefeito,
            estado: 'ABERTA',
            cliente: 'Cliente',
            valorOrcamento: null,
            dataHoraOrcamento: null,
            funcionarioOrcamento: null,
            motivoRejeicao: null,
            dataHoraPagamento: null,
            historico: [{
                dataHora,
                estadoAnterior: null,
                estadoNovo: 'ABERTA',
                funcionario: null
            }],
            funcionarioResponsavel: null,
            funcionarioRedirecionado: null
        };

        this.solicitacoes.push(solicitacao);
        return solicitacao;
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

    // RF009 - Resgatar Servico: o que estava REJEITADA volta para APROVADA
    resgatar(id : number) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao || solicitacao.estado !== 'REJEITADA') {
            return;
        }
        this.alterarEstado(id, 'APROVADA', 'Servico resgatado pelo cliente.');
    }

    // RF010 - Pagar Servico: registra a data/hora do pagamento
    pagar(id : number) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao || solicitacao.estado !== 'ARRUMADA') {
            return;
        }
        solicitacao.dataHoraPagamento = dataHoraAtual();
        this.alterarEstado(id, 'PAGA', `Pagamento confirmado em ${solicitacao.dataHoraPagamento}.`);
    }

    private alterarEstado(
        id: number,
        novoEstado: EstadoSolicitacao,
        observacao?: string,
        funcionario: string | null = null
    ) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) {
            return;
        }
        solicitacao.historico.push({
            dataHora: dataHoraAtual(),
            estadoAnterior: solicitacao.estado,
            estadoNovo: novoEstado,
            funcionario,
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
        this.alterarEstado(id, "ORCADA", undefined, funcionario);

    }

    //RF 013 - Listar todas as solicitacoes para um funcionario especifico
    listarParaFuncionario(funcionario : string) : Solicitacao[]{
        return this.solicitacoes.filter(s => s.estado !== 'REDIRECIONADA' || s.funcionarioRedirecionado === funcionario).sort((a, b) => this.paraTimestamp(a.dataHora) - this.paraTimestamp(b.dataHora));
    }

    // RF014 - Efetuar Manutenção
    efetuarManutencao(id: number, descricao: string, orientacoes: string, funcionario: string) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) return;
        
        solicitacao.historico.push({
            dataHora: dataHoraAtual(),
            estadoAnterior: solicitacao.estado,
            estadoNovo: 'ARRUMADA',
            funcionario: funcionario,
            observacao: `Manutenção: ${descricao} | Orientações: ${orientacoes}`
        });
        solicitacao.estado = 'ARRUMADA';
    }

    // RF015 - Redirecionar Manutenção
    redirecionarManutencao(id: number, funcOrigem: string, nomeFuncDestino: string) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) return;
        
        solicitacao.funcionarioRedirecionado = nomeFuncDestino;
        solicitacao.historico.push({
            dataHora: dataHoraAtual(),
            estadoAnterior: solicitacao.estado,
            estadoNovo: 'REDIRECIONADA',
            funcionario: funcOrigem,
            observacao: `Redirecionado para ${nomeFuncDestino}`
        });
        solicitacao.estado = 'REDIRECIONADA';
    }

    // RF016 - Finalizar Solicitação
    finalizarSolicitacao(id: number, funcionario: string) {
        const solicitacao = this.buscarPorId(id);
        if (!solicitacao) return;
        
        solicitacao.historico.push({
            dataHora: dataHoraAtual(),
            estadoAnterior: solicitacao.estado,
            estadoNovo: 'FINALIZADA',
            funcionario: funcionario
        });
        solicitacao.estado = 'FINALIZADA';
    }

    private paraTimestamp(dataHora : string) : number{
        const [data, hora] = dataHora.split(' ');
        const [dia, mes, ano] = data.split('/');
        const [horaNum, minuto] = hora.split(':');
        return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(horaNum), Number(minuto)).getTime();
    }
}
