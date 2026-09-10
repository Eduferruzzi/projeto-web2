import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';
import { MoedaBrPipe } from '../../pipes';
import { formatarMoedaBr } from '../../shared';

// RF010 - Pagar Servico
@Component({
  selector: 'app-payment',
  imports: [RouterLink, MoedaBrPipe],
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
    this.mensagem = `Pagamento de ${formatarMoedaBr(this.solicitacao.valorOrcamento)} confirmado em ${this.solicitacao.dataHoraPagamento}.`;
  }
}
