import { Injectable, inject } from '@angular/core';
import { Solicitacao, EstadoSolicitacao, HistoricoSolicitacao } from '../models/Solicitacao';
import { dataHoraAtual } from '../shared';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface SolicitacaoInput {
    clienteId: number,
    categoriaId: number,
    descricaoEquipamento: string,
    descricaoDefeito: string
}

const API_URL = 'http://localhost:8080/solicitacoes';

export interface SolicitacaoAPI {
  id: number;
  dataHora: string;
  descricaoEquipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: EstadoSolicitacao;
  clienteId: number | null;
  cliente: string | null;
  valorOrcamento: number | null;
  dataHoraOrcamento: string | null;
  funcionarioOrcamento: string | null;
  motivoRejeicao: string | null;
  descricaoManutencao: string | null;
  orientacoesCliente: string | null;
  dataHoraPagamento: string | null;
  dataHoraFinalizacao: string | null;
  funcionarioResponsavel: string | null;
  historico: HistoricoAPI[];
}

export interface HistoricoAPI {
  id: number;
  dataHora: string;
  estadoAnterior: EstadoSolicitacao | null;
  estadoNovo: EstadoSolicitacao;
  funcionarioOrigem: string | null;
  funcionarioDestino: string | null;
  observacao: string | null;
}

// Dados em memoria enquanto a API (Spring Boot) nao esta integrada.
@Injectable({
    providedIn: 'root'
})
export class SolicitacaoService {
    private readonly http = inject(HttpClient);

    buscarPorIdECliente(id: number, clienteId: number): Observable<Solicitacao> {
        return this.http.get<SolicitacaoAPI>(`${API_URL}/${id}/cliente?clienteId=${clienteId}`).pipe(
                map(resposta => this.paraSolicitacao(resposta))
            )
    }

    buscarPorId(id: number): Observable<Solicitacao> {
        return this.http.get<SolicitacaoAPI>(`${API_URL}/${id}`).pipe(
                map(resposta => this.paraSolicitacao(resposta))
            )
    }

    listarPorCliente(clienteId: number): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(`${API_URL}/cliente?clienteId=${clienteId}`).pipe(
                map(solicitacoes => solicitacoes.map(solicitacao => this.paraSolicitacao(solicitacao)))
            )
    }

    listarAtivas(): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(`${API_URL}/ativas`).pipe(
                map(solicitacoes => solicitacoes.map(solicitacao => this.paraSolicitacao(solicitacao)))
            )
    }

    registrarOrcamento(solicitacaoId: number, funcionarioId: number, valorOrcamento: number): Observable<void> {
        return this.http.put<void>(`${API_URL}/${solicitacaoId}/orcamento/${funcionarioId}`,{ valorOrcamento }
        )
    }   

    cadastrar(solicitacao: SolicitacaoInput): Observable<Solicitacao> {
        return this.http.post<SolicitacaoAPI>(API_URL, solicitacao).pipe(
                map((resposta) => this.paraSolicitacao(resposta))
            )
    }

    // RF006 - Aprovar Servico
    aprovar(id : number, clienteId : number): Observable<void> {
        return this.http.put<void>(`${API_URL}/${id}/aprovar?clienteId=${clienteId}`, {}).pipe(
            catchError((error) => {
                console.error('Erro ao aprovar a solicitação:', error);
                return throwError(() => error);
            })
        );
    }

    // RF007 - Rejeitar Servico
    rejeitar(id : number, motivo : string, clienteId : number): Observable<void> {
        return this.http.put<void>(`${API_URL}/${id}/rejeitar?clienteId=${clienteId}`, { motivo }).pipe(
            catchError((error) => {
                console.error('Erro ao rejeitar a solicitação:', error);
                return throwError(() => error);
            })
        );
    }

    // RF009 - Resgatar Servico: o que estava REJEITADA volta para APROVADA
    resgatar(id : number, clienteId : number) : Observable<void> {
        return this.http.put<void>(`${API_URL}/${id}/resgatar?clienteId=${clienteId}`, {}).pipe(
            catchError((error) => {
                console.error('Erro ao resgatar a solicitação:', error);
                return throwError(() => error);
            })
        );
    }

    // RF010 - Pagar Servico: registra a data/hora do pagamento
    pagar(id : number, clienteId : number): Observable<void> {
        return this.http.put<void>(`${API_URL}/${id}/pagar?clienteId=${clienteId}`, {}).pipe(
            catchError((error) => {
                console.error('Erro ao pagar a solicitação:', error);
                return throwError(() => error);
            })
        );
    }

    // RF015 - Alterar estado de uma solicitação
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

    listarAbertasAPI(): Observable<SolicitacaoAPI[]> {

        return this.http.get<SolicitacaoAPI[]>(`${API_URL}/abertas`);
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

    private paraSolicitacao(solicitacaoAPI: SolicitacaoAPI): Solicitacao {
  return {
    id: solicitacaoAPI.id,
    dataHora: solicitacaoAPI.dataHora,
    descricaoEquipamento: solicitacaoAPI.descricaoEquipamento,
    categoria: solicitacaoAPI.categoria,
    descricaoDefeito: solicitacaoAPI.descricaoDefeito,
    estado: solicitacaoAPI.estado,
    clienteId: solicitacaoAPI.clienteId ?? undefined,
    cliente: solicitacaoAPI.cliente ?? '',
    valorOrcamento: solicitacaoAPI.valorOrcamento,
    dataHoraOrcamento: solicitacaoAPI.dataHoraOrcamento,
    funcionarioOrcamento: solicitacaoAPI.funcionarioOrcamento,
    motivoRejeicao: solicitacaoAPI.motivoRejeicao,
    dataHoraPagamento: solicitacaoAPI.dataHoraPagamento,
    funcionarioResponsavel: solicitacaoAPI.funcionarioResponsavel,
    funcionarioRedirecionado: null,
    historico: solicitacaoAPI.historico.map(historico => ({
      dataHora: historico.dataHora,
      estadoAnterior: historico.estadoAnterior,
      estadoNovo: historico.estadoNovo,
      funcionario: historico.funcionarioOrigem ?? historico.funcionarioDestino,
      observacao: historico.observacao ?? undefined
    }))
  };
}
}
