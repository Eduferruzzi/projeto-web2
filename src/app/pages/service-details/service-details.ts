import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoricoSolicitacao, Solicitacao } from '../../models/Solicitacao';
import { SolicitacaoService } from '../../services';

@Component({
  selector: 'app-service-details',
  imports: [FormsModule, RouterLink],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao: Solicitacao | undefined;
  mostrarRejeicao = false;
  motivoRejeicao = '';
  erroMotivo = '';
  mensagem = '';
  mensagemSucesso = true;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  aprovarServico(): void {
    if (!this.solicitacao) {
      return;
    }

    const valor = this.formatarValor(this.solicitacao.valorOrcamento);
    this.solicitacaoService.aprovar(this.solicitacao.id);
    this.mensagem = `Serviço aprovado no valor de ${valor}.`;
    this.mensagemSucesso = true;
  }

  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
    this.motivoRejeicao = '';
    this.erroMotivo = '';
  }

  cancelarRejeicao(): void {
    this.mostrarRejeicao = false;
    this.motivoRejeicao = '';
    this.erroMotivo = '';
  }

  rejeitarServico(): void {
    if (!this.solicitacao) {
      return;
    }

    if (this.motivoRejeicao.trim().length < 5) {
      this.erroMotivo = 'O motivo deve possuir pelo menos 5 caracteres.';
      return;
    }

    this.solicitacaoService.rejeitar(
      this.solicitacao.id,
      this.motivoRejeicao.trim()
    );
    this.mostrarRejeicao = false;
    this.mensagem = 'Serviço rejeitado.';
    this.mensagemSucesso = false;
  }

  fecharMensagem(): void {
    this.mensagem = '';
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

  descreverPasso(passo: HistoricoSolicitacao): string {
    if (passo.estadoAnterior === null) {
      return `Solicitação criada como ${passo.estadoNovo}`;
    }

    return `${passo.estadoAnterior} para ${passo.estadoNovo}`;
  }
}
