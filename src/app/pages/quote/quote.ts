import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';

// RF005 - Mostrar orcamento (inclui RF006 aprovar e RF007 rejeitar)
@Component({
  selector: 'app-quote',
  imports: [CommonModule, FormsModule],
  templateUrl: './quote.html',
  styleUrl: './quote.css',
})
export class Quote {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao : Solicitacao | undefined;

  mostrarFormRejeicao = false;
  motivoRejeicao = '';
  erroMotivo = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  // RF006 - Aprovar Servico
  aprovar() {
    if (!this.solicitacao) {
      return;
    }
    this.solicitacaoService.aprovar(this.solicitacao.id);
    window.alert(`Serviço Aprovado no Valor ${this.formatarValor(this.solicitacao.valorOrcamento)}`);
    this.router.navigate(['/user-home']);
  }

  // RF007 - Rejeitar Servico
  abrirRejeicao() {
    this.mostrarFormRejeicao = true;
  }

  cancelarRejeicao() {
    this.mostrarFormRejeicao = false;
    this.motivoRejeicao = '';
    this.erroMotivo = '';
  }

  confirmarRejeicao() {
    if (!this.solicitacao) {
      return;
    }
    if (this.motivoRejeicao.trim().length < 5) {
      this.erroMotivo = 'Informe o motivo da rejeição (mínimo 5 caracteres).';
      return;
    }
    this.solicitacaoService.rejeitar(this.solicitacao.id, this.motivoRejeicao.trim());
    window.alert('Serviço Rejeitado');
    this.router.navigate(['/user-home']);
  }

  formatarValor(valor : number | null) : string {
    if (valor === null) {
      return 'R$ 0,00';
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
