import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoSolicitacao } from '../../models/Solicitacao';

@Component({
  selector: 'app-request-history',
  imports: [CommonModule],
  templateUrl: './request-history.html',
  styleUrl: './request-history.css',
})
export class RequestHistory {
  @Input() historico: HistoricoSolicitacao[] = [];

  get historicoOrdenado(): HistoricoSolicitacao[] {
    return [...this.historico].sort((a, b) => this.paraTimestamp(a.dataHora) - this.paraTimestamp(b.dataHora));
  }

  private paraTimestamp(dataHora: string): number {
    return new Date(dataHora).getTime();
  }

  descreverPasso(passo: HistoricoSolicitacao): string {
    if (passo.estadoAnterior === null) {
      return `Solicitação criada como ${passo.estadoNovo}`;
    }

    return `${passo.estadoAnterior} para ${passo.estadoNovo}`;
  }

  mostrarResponsavel(passo: HistoricoSolicitacao): string {
    if (passo.estadoNovo === 'REDIRECIONADA') {
      return `${passo.funcionarioOrigem ?? 'Não informado'} → ${passo.funcionarioDestino ?? 'Não informado'}`;
    }
    return passo.funcionarioOrigem ?? passo.funcionarioDestino ?? 'Cliente';
  }
}
