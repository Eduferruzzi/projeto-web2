import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginService, SolicitacaoService } from '../../services';
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
  private loginService = inject(LoginService);

  solicitacao: Solicitacao | undefined;
  clienteId: number | undefined;
  mensagemSucesso = true;
  mensagem = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clienteId = Number(this.loginService.usuarioLogado?.id);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(this.clienteId) || this.clienteId <= 0) {
      this.mensagem = 'ID de solicitação ou de cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }
    this.solicitacaoService.buscarPorIdECliente(id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
      },
      error: (error) => {
        this.mensagem = 'Erro ao buscar a solicitação.';
        this.mensagemSucesso = false;
      }
    });
  }

  confirmarPagamento(): void {
    if (!this.solicitacao) {
      return;
    }

    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }

    this.solicitacaoService.pagar(this.solicitacao.id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
        this.mensagem = `Pagamento de ${formatarMoedaBr(this.solicitacao.valorOrcamento)} confirmado em ${this.solicitacao.dataHoraPagamento}.`;
        this.mensagemSucesso = true;
      },
      error: (error) => {
        this.mensagem = 'Erro ao confirmar o pagamento.';
        this.mensagemSucesso = false;
      }
    });
  }
}
