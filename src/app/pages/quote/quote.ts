import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService, SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';
import { MoedaBrPipe } from '../../pipes';
import { formatarMoedaBr } from '../../shared';

// RF005 - Mostrar orcamento (inclui RF006 aprovar e RF007 rejeitar)
@Component({
  selector: 'app-quote',
  imports: [CommonModule, FormsModule, RouterLink, MoedaBrPipe],
  templateUrl: './quote.html',
  styleUrl: './quote.css',
})
export class Quote {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);

  solicitacao = signal<Solicitacao | undefined>(undefined);
  clienteId: number | undefined;
  mostrarFormRejeicao = false;
  motivoRejeicao = '';
  mensagem = '';
  mensagemSucesso = true;

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

  // RF006 - Aprovar Servico
  aprovar() {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }
    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }
    this.solicitacaoService.aprovar(solicitacao.id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        window.alert(`Serviço Aprovado no Valor ${formatarMoedaBr(solicitacao.valorOrcamento)}`);
        this.router.navigate(['/user-home']);
      },
      error: (error) => {
        this.mensagem = 'Erro ao aprovar o serviço.';
        this.mensagemSucesso = false;
      }
    });
  }

  // RF007 - Rejeitar Servico
  abrirRejeicao() {
    this.mostrarFormRejeicao = true;
  }

  cancelarRejeicao() {
    this.mostrarFormRejeicao = false;
    this.motivoRejeicao = '';
    this.mensagem = '';
  }

  confirmarRejeicao() {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }
    if (this.motivoRejeicao.trim().length < 5) {
      this.mensagem = 'Informe o motivo da rejeição (mínimo 5 caracteres).';
      return;
    }
    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }
    this.solicitacaoService.rejeitar(solicitacao.id, this.motivoRejeicao.trim(), this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mostrarFormRejeicao = false;
        window.alert('Serviço Rejeitado');
        this.router.navigate(['/user-home']);
      },
      error: (error) => {
        this.mensagem = 'Erro ao rejeitar o serviço.';
        this.mensagemSucesso = false;
      }
    });
  }
}
