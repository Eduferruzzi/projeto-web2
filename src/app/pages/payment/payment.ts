import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginService, SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';
import { MoedaBrPipe } from '../../pipes';
import { formatarMoedaBr } from '../../shared';

// RF010 - Pagar Servico
@Component({
  selector: 'app-payment',
  imports: [CommonModule, RouterLink, MoedaBrPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {
  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);

  solicitacao = signal<Solicitacao | undefined>(undefined);
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
        this.solicitacao.set(solicitacao);
      },
      error: (error) => {
        this.mensagem = 'Erro ao buscar a solicitação.';
        this.mensagemSucesso = false;
      }
    });
  }

  confirmarPagamento(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }

    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }

    this.solicitacaoService.pagar(solicitacao.id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        const dataPagamento = this.formatarDataPagamento(solicitacao.dataHoraPagamento);
        this.mensagem = `Pagamento de ${formatarMoedaBr(solicitacao.valorOrcamento)} confirmado em ${dataPagamento}.`;
        this.mensagemSucesso = true;
      },
      error: (error) => {
        this.mensagem = 'Erro ao confirmar o pagamento.';
        this.mensagemSucesso = false;
      }
    });
  }

  private formatarDataPagamento(dataHora: string | null): string {
    if (!dataHora) {
      return '';
    }

    const [data, hora = ''] = dataHora.split('T');
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano} ${hora.substring(0, 5)}`;
  }
}
