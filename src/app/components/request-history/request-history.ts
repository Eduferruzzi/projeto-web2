import { Component, Input } from '@angular/core';
import { HistoricoSolicitacao } from '../../models/Solicitacao';

@Component({
  selector: 'app-request-history',
  imports: [],
  templateUrl: './request-history.html',
  styleUrl: './request-history.css',
})
export class RequestHistory {
  @Input() historico: HistoricoSolicitacao[] = [];

  get historicoOrdenado(): HistoricoSolicitacao[] {
    return [...this.historico].sort((a, b) => this.paraTimestamp(a.dataHora) - this.paraTimestamp(b.dataHora));
  }

  private paraTimestamp(dataHora: string): number {
    const [data, hora = '00:00'] = dataHora.split(' ');
    const [dia, mes, ano] = data.split('/').map(Number);
    const [horas, minutos] = hora.split(':').map(Number);
    return new Date(ano, mes - 1, dia, horas, minutos).getTime();
  }

  descreverPasso(passo: HistoricoSolicitacao): string {
    if (passo.estadoAnterior === null) {
      return `Solicitação criada como ${passo.estadoNovo}`;
    }

    return `${passo.estadoAnterior} para ${passo.estadoNovo}`;
  }

  mostrarResponsavel(passo: HistoricoSolicitacao): string {
    return passo.funcionario ?? 'Cliente';
  }
}
