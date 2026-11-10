import { ChangeDetectorRef, Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Solicitacao } from '../../models/Solicitacao'
import { LoginService, SolicitacaoService } from '../../services'
import { RequestHistory } from '../../components/request-history'
import { MoedaBrPipe } from '../../pipes'
import { formatarMoedaBr } from '../../shared'

@Component({
  selector: 'app-service-details',
  imports: [CommonModule, FormsModule, RouterLink, RequestHistory, MoedaBrPipe],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  private detector = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);

  solicitacao = signal<Solicitacao | undefined>(undefined);
  clienteId: number | undefined; 
  mostrarRejeicao = false;
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

  aprovarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }

    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }

    const valor = formatarMoedaBr(solicitacao.valorOrcamento);
    this.solicitacaoService.aprovar(solicitacao.id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mensagem = `Serviço aprovado no valor de ${valor}.`;
        this.mensagemSucesso = true;
      },
      error: (error) => {
        this.mensagem = 'Erro ao aprovar o serviço.';
        this.mensagemSucesso = false;
      }
    });
  }

  abrirRejeicao(): void {
    this.mostrarRejeicao = true;
    this.motivoRejeicao = '';
    this.mensagem = '';
  }

  cancelarRejeicao(): void {
    this.mostrarRejeicao = false;
    this.motivoRejeicao = '';
    this.mensagem = '';
  }

  rejeitarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }

    if (this.motivoRejeicao.trim().length < 5) {
      this.mensagem = 'O motivo deve possuir pelo menos 5 caracteres.';
      this.mensagemSucesso = false;
      return;
    }

    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }

    this.mensagem = '';
    this.solicitacaoService.rejeitar(
      solicitacao.id,
      this.motivoRejeicao.trim(),
      this.clienteId
    ).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mostrarRejeicao = false;
        this.mensagem = 'Serviço rejeitado.';
        this.mensagemSucesso = true;
      },
      error: (error) => {
        this.mensagem = 'Erro ao rejeitar o serviço.';
        this.mensagemSucesso = false;
        this.detector.markForCheck();
      }
    });
  }

  // RF009 - Resgatar Servico
  resgatarServico(): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      return;
    }
    if (!this.clienteId) {
      this.mensagem = 'ID do cliente inválido.';
      this.mensagemSucesso = false;
      return;
    }

    this.mensagem = '';
    this.solicitacaoService.resgatar(solicitacao.id, this.clienteId).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.mensagem = 'Serviço resgatado. A solicitação voltou para o estado APROVADA.';
        this.mensagemSucesso = true;
      },
      error: (error) => {
        this.mensagem = 'Erro ao resgatar o serviço.';
        this.mensagemSucesso = false;
        this.detector.markForCheck();
      }
    });
  }

  fecharMensagem(): void {
    this.mensagem = '';
  }
}
