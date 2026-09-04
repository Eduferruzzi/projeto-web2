import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';

// RF010 - Pagar Servico
@Component({
  selector: 'app-payment',
  imports: [RouterLink],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao: Solicitacao | undefined;
  mensagem = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  confirmarPagamento(): void {
    if (!this.solicitacao) {
      return;
    }

    this.solicitacaoService.pagar(this.solicitacao.id);
    this.mensagem = `Pagamento de ${this.formatarValor(this.solicitacao.valorOrcamento)} confirmado em ${this.solicitacao.dataHoraPagamento}.`;
  }

  formatarValor(valor: number | null): string {
    if (valor === null) {
      return 'Não informado';
    }

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
