import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { Solicitacao } from '../../models/Solicitacao'
import { LoginService, SolicitacaoService } from '../../services'
import { RequestHistory } from '../../components/request-history'
import { MoedaBrPipe } from '../../pipes'
import { formatarMoedaBr } from '../../shared'
import { finalize } from 'rxjs'

@Component({
  selector: 'app-service-details',
  imports: [CommonModule, FormsModule, RouterLink, RequestHistory, MoedaBrPipe],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  private router = inject(Router);
  private voltarAposAprovacao = false;
  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);

  solicitacao = signal<Solicitacao | undefined>(undefined);
  clienteId: number | undefined; 
  mostrarRejeicao = false;
  motivoRejeicao = '';
  mensagem = signal('');
  carregando = signal(true);
  salvando = signal(false);
  mensagemSucesso = true;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clienteId = Number(this.loginService.usuarioLogado?.id);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(this.clienteId) || this.clienteId <= 0) {
      this.carregando.set(false);
      this.mensagem.set('ID de solicitação ou de cliente inválido.');
      this.mensagemSucesso = false;
      return;
    }
    this.solicitacaoService.buscarPorIdECliente(id, this.clienteId)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
      },
      error: () => {
        this.mensagem.set('Erro ao buscar a solicitação.');
        this.mensagemSucesso = false;
      }
    });
  }

  aprovarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao || this.salvando() || solicitacao.estado !== 'ORCADA') {
      return;
    }

    if (!this.clienteId) {
      this.mensagem.set('ID do cliente inválido.');
      this.mensagemSucesso = false;
      return;
    }

    this.mensagem.set('');
    this.salvando.set(true);
    const valor = formatarMoedaBr(solicitacao.valorOrcamento);
    this.solicitacaoService.aprovar(solicitacao.id, this.clienteId)
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.voltarAposAprovacao = true;
        this.mensagem.set(`Serviço aprovado no valor de ${valor}.`);
        this.mensagemSucesso = true;
      },
      error: () => {
        this.mensagem.set('Erro ao aprovar o serviço.');
        this.mensagemSucesso = false;
      }
    });
  }

  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
    this.motivoRejeicao = '';
    this.mensagem.set('');
  }

  cancelarRejeicao(): void {
    this.mostrarRejeicao = false;
    this.motivoRejeicao = '';
    this.mensagem.set('');
  }

  rejeitarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao || this.salvando() || solicitacao.estado !== 'ORCADA') {
      return;
    }

    if (this.motivoRejeicao.trim().length < 5) {
      this.mensagem.set('O motivo deve possuir pelo menos 5 caracteres.');
      this.mensagemSucesso = false;
      return;
    }

    if (!this.clienteId) {
      this.mensagem.set('ID do cliente inválido.');
      this.mensagemSucesso = false;
      return;
    }

    this.mensagem.set('');
    this.salvando.set(true);
    this.solicitacaoService.rejeitar(
      solicitacao.id,
      this.motivoRejeicao.trim(),
      this.clienteId
    ).pipe(finalize(() => this.salvando.set(false))).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mostrarRejeicao = false;
        this.mensagem.set('Serviço rejeitado.');
        this.mensagemSucesso = true;
      },
      error: () => {
        this.mensagem.set('Erro ao rejeitar o serviço.');
        this.mensagemSucesso = false;
      }
    });
  }

  // RF009 - Resgatar Servico
  resgatarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao || this.salvando() || solicitacao.estado !== 'REJEITADA') {
      return;
    }
    if (!this.clienteId) {
      this.mensagem.set('ID do cliente inválido.');
      this.mensagemSucesso = false;
      return;
    }

    this.mensagem.set('');
    this.salvando.set(true);
    this.solicitacaoService.resgatar(solicitacao.id, this.clienteId)
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mensagem.set('Serviço resgatado. A solicitação voltou para o estado APROVADA.');
        this.mensagemSucesso = true;
      },
      error: () => {
        this.mensagem.set('Erro ao resgatar o serviço.');
        this.mensagemSucesso = false;
      }
    });
  }

  fecharMensagem(): void {
    this.mensagem.set('');
    if (this.voltarAposAprovacao) {
      this.router.navigate(['/user-home']);
    }
  }
}
