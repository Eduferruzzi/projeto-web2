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
