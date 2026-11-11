import { Injectable, inject } from '@angular/core';
import { Solicitacao, EstadoSolicitacao } from '../models/Solicitacao';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface SolicitacaoInput {
    clienteId: number,
    categoriaId: number,
    descricaoEquipamento: string,
    descricaoDefeito: string
}

const API_URL = 'http://localhost:8080/solicitacoes';
const AUTH_OPTIONS = { withCredentials: true };

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
        // RF013 - Solicitações visíveis para o funcionário
    listarVisiveis(funcionarioId: number): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(
            `${API_URL}/visiveis/${funcionarioId}`, AUTH_OPTIONS
        ).pipe(
            map(dados => dados.map(s => this.paraSolicitacao(s)))
        );
    }

    // Solicitações atribuídas ao funcionário
    listarAtribuidas(funcionarioId: number): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(
            `${API_URL}/atribuidas/${funcionarioId}`, AUTH_OPTIONS
        ).pipe(
            map(dados => dados.map(s => this.paraSolicitacao(s)))
        );
    }

    listarTodas(): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(`${API_URL}`).pipe(
                map(solicitacoes => solicitacoes.map(solicitacao => this.paraSolicitacao(solicitacao)))
            )
    }

    cadastrar(solicitacao: SolicitacaoInput): Observable<Solicitacao> {
        return this.http.post<SolicitacaoAPI>(API_URL, solicitacao).pipe(
                map((resposta) => this.paraSolicitacao(resposta))
            )
    }

    // RF006 - Aprovar Servico
    aprovar(id : number, clienteId : number): Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${id}/aprovar?clienteId=${clienteId}`, {}).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    // RF007 - Rejeitar Servico
    rejeitar(id : number, motivo : string, clienteId : number): Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${id}/rejeitar?clienteId=${clienteId}`, { motivo }).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    // RF009 - Resgatar Servico: o que estava REJEITADA volta para APROVADA
    resgatar(id : number, clienteId : number) : Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${id}/resgatar?clienteId=${clienteId}`, {}).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    // RF010 - Pagar Servico: registra a data/hora do pagamento
    pagar(id : number, clienteId : number): Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${id}/pagar?clienteId=${clienteId}`, {}).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    // RFs 14-16 Alterar estado de uma solicitação
    alterarEstado(
        solicitacaoId: number,
        funcionarioId: number | null,
        observacao: string | null,
        status: EstadoSolicitacao,
        descricaoManutencao: string | null = null,
        orientacoesCliente: string | null = null
    ): Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${solicitacaoId}/status`, {
            funcionarioId,
            observacao,
            status,
            descricaoManutencao,
            orientacoesCliente
        }, AUTH_OPTIONS).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    // RF 011 - Somente solicitacoes em aberto
    listarAbertas(): Observable<Solicitacao[]> {
        return this.http.get<SolicitacaoAPI[]>(`${API_URL}/abertas`).pipe(
            map(solicitacoes => solicitacoes.map(solicitacao => this.paraSolicitacao(solicitacao)))
        );
    }

    // RF 012 Efetuar o orcamento 
    efetuarOrcamento(id : number, funcionarioId : number, valor : number): Observable<void> {
        return this.http.put<void>(
            `${API_URL}/${id}/orcamento/${funcionarioId}`,
            { valorOrcamento: valor },
            AUTH_OPTIONS
        ).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    //RF 013 - Listar todas as solicitacoes para um funcionario especifico
    listarParaFuncionario(funcionario : string) : Observable<Solicitacao[]>{
        return this.http.get<SolicitacaoAPI[]>(`${API_URL}/funcionario?funcionario=${funcionario}`).pipe(
            map(solicitacoes => solicitacoes.map(solicitacao => this.paraSolicitacao(solicitacao)))
        );
    }

    // RF015 - Redirecionar Manutenção
    redirecionarManutencao(solicitacaId: number, funcionarioOrigemId: number, funcionarioDestinoId: number):Observable<Solicitacao> {
        return this.http.put<SolicitacaoAPI>(`${API_URL}/${solicitacaId}/redirecionar`, {
            funcionarioOrigemId,
            funcionarioDestinoId
        }, AUTH_OPTIONS).pipe(
            map((resposta) => this.paraSolicitacao(resposta)),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    private paraSolicitacao(solicitacaoAPI: SolicitacaoAPI): Solicitacao {
        return {
            id: solicitacaoAPI.id,
            dataHora: solicitacaoAPI.dataHora,
            descricaoEquipamento: solicitacaoAPI.descricaoEquipamento,
            categoria: solicitacaoAPI.categoria,
            descricaoDefeito: solicitacaoAPI.descricaoDefeito,
            estado: solicitacaoAPI.estado,
            clienteId: solicitacaoAPI.clienteId ?? null,
            cliente: solicitacaoAPI.cliente ?? '',
            valorOrcamento: solicitacaoAPI.valorOrcamento,
            dataHoraOrcamento: solicitacaoAPI.dataHoraOrcamento,
            funcionarioOrcamento: solicitacaoAPI.funcionarioOrcamento,
            motivoRejeicao: solicitacaoAPI.motivoRejeicao,
            dataHoraPagamento: solicitacaoAPI.dataHoraPagamento,
            funcionarioResponsavel: solicitacaoAPI.funcionarioResponsavel,
            funcionarioRedirecionado: null,
            descricaoManutencao: solicitacaoAPI.descricaoManutencao,
            orientacoesCliente: solicitacaoAPI.orientacoesCliente,
            dataHoraFinalizacao: solicitacaoAPI.dataHoraFinalizacao,
            historico: solicitacaoAPI.historico.map(historico => ({
                dataHora: historico.dataHora,
                estadoAnterior: historico.estadoAnterior,
                estadoNovo: historico.estadoNovo,
                funcionarioOrigem: historico.funcionarioOrigem,
                funcionarioDestino: historico.funcionarioDestino,
                observacao: historico.observacao ?? undefined
            }))
        };
    }
}
