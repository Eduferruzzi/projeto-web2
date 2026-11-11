import { ConfirmModal } from '../../components/confirm-modal';
import { ChangeDetectorRef, ViewChild, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao-service'; 
import { UserService } from '../../services/user-service'; 
import { Solicitacao } from '../../models/Solicitacao';
import { User } from '../../models/user';
import { LoginService } from '../../services'
import { EstadoSolicitacao } from '../../models/Solicitacao';

@Component({
  selector: 'app-execute-maintenance',
  imports: [ConfirmModal, CommonModule, RouterLink],
  templateUrl: './execute-maintenance.html',
  styleUrl: './execute-maintenance.css'
})
export class ExecuteMaintenance implements OnInit {
  @ViewChild(ConfirmModal) modal!: ConfirmModal;
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private solicitacaoService = inject(SolicitacaoService); 
  private userService = inject(UserService);
  private loginService = inject(LoginService);
  private detector = inject(ChangeDetectorRef);

  // variaveis de estado do componente
  solicitacao = signal<Solicitacao | undefined>(undefined);
  funcionariosSelect = signal<User[]>([]);
  
  funcionarioId: number | undefined;

  // flag p controle de exibição
  exibirRedirecionamento: boolean = false;
  exibirFormConclusao: boolean = true;
  mensagemSucesso = true;
  mensagem = '';

  // busca a solicitacao com base no id da url p inicializar os dados
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const funcionarioLogado = this.loginService.usuarioLogado?.id;
    this.funcionarioId = funcionarioLogado ? Number(funcionarioLogado) : undefined;
    if (!this.funcionarioId || !Number.isInteger(id) || id <= 0) {
      this.mensagem = 'Funcionário ou solicitação inválidos.';
      this.mensagemSucesso = false;
      return;
    }
    this.solicitacaoService.listarAtribuidas(this.funcionarioId).subscribe({
      next: (solicitacoes) => {
        const solicitacao = solicitacoes.find(s => s.id === id);
        if (!solicitacao || !['APROVADA', 'REDIRECIONADA'].includes(solicitacao.estado)) {
          this.mensagem = 'Esta manutenção não está disponível para você. Somente o funcionário responsável pode realizá-la ou redirecioná-la.';
          this.mensagemSucesso = false;
          this.detector.markForCheck();
          return;
        }
        this.solicitacao.set(solicitacao);
      },
      error: (error: HttpErrorResponse) => {
        this.mensagem = this.mensagemErro(error, 'Erro ao buscar a solicitação.');
        this.mensagemSucesso = false;
        this.detector.markForCheck();
      }
    });

    // carrega os funcionarios menos vc mesmo
    this.userService.listarTodos().subscribe({
      next: funcionarios => {
        this.funcionariosSelect.set(
          funcionarios.filter(funcionario => funcionario.id !== this.funcionarioId)
        );
      },
      error: (error: HttpErrorResponse) => {
        this.mensagem = this.mensagemErro(error, 'Erro ao carregar os funcionários disponíveis.');
        this.mensagemSucesso = false;
      }
    });
  }

  // valida campos, confirma e grava
  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao || !orientacoes) {
      this.modal.abrir('Por favor, preencha todos os campos da manutenção.', undefined, true);
      return;
    }
    this.modal.abrir('Tem certeza que deseja concluir esta manutenção?', () => {
      const status: EstadoSolicitacao = "ARRUMADA";
      const obs = `Descrição da manutenção: ${descricao}. Orientações ao cliente: ${orientacoes}`;
      const solicitacao = this.solicitacao();
      if (!solicitacao) {
        this.mensagem = 'Solicitação não encontrada.';
        this.mensagemSucesso = false;
        return;
      }
      if (!this.funcionarioId) {
        this.mensagem = 'ID do funcionário inválido.';
        this.mensagemSucesso = false;
        return;
      }
      this.solicitacaoService.alterarEstado(
        solicitacao.id,
        this.funcionarioId!,
        obs,
        status,
        descricao.trim(),
        orientacoes.trim()
      )
        .subscribe({
          next: () => this.router.navigate(['/employee-requests']),
          error: (error: HttpErrorResponse) => {
            this.mensagem = this.mensagemErro(error, 'Erro ao concluir a manutenção.');
            this.mensagemSucesso = false;
            this.detector.markForCheck();
          }
        });
    });
  }

  // valida seleção, confirma e grava
  redirecionarManutencao(funcionarioId: string): void {
    const solicitacao = this.solicitacao();
    if (!solicitacao) {
      this.mensagem = 'Solicitação não encontrada.';
      this.mensagemSucesso = false;
      return;
    }
    if (!this.funcionarioId) {
      this.mensagem = 'ID do funcionário inválido.';
      this.mensagemSucesso = false;
      return;
    }
    if (!funcionarioId) {
      this.mensagem = 'Selecione um funcionário para redirecionar a manutenção.';
      this.mensagemSucesso = false;
      return;
    }
    const idFuncionarioDestino = Number(funcionarioId);
    if (!Number.isInteger(idFuncionarioDestino) || idFuncionarioDestino <= 0) {
      this.mensagem = 'ID do funcionário selecionado inválido.';
      this.mensagemSucesso = false;
      return;
    }
    this.modal.abrir('Tem certeza que deseja redirecionar esta manutenção para outro funcionário?', () => {
      this.solicitacaoService.redirecionarManutencao(solicitacao.id, this.funcionarioId!, idFuncionarioDestino)
        .subscribe({
          next: () => this.router.navigate(['/employee-requests']),
          error: (error: HttpErrorResponse) => {
            this.mensagem = this.mensagemErro(error, 'Erro ao redirecionar a manutenção.');
            this.mensagemSucesso = false;
            this.detector.markForCheck();
          }
        });
    });
  }

  // alterna a exibicao de redirecionamento/conclusao
  alternarRedirecionamento(mostrar: boolean): void {
    this.exibirRedirecionamento = mostrar;
    this.exibirFormConclusao = !mostrar;
  }


  // cancela a operação e volta pra tela de solicitações
  cancelar(): void {
    this.router.navigate(['/employee-requests']);
  }

  private mensagemErro(error: HttpErrorResponse, mensagemPadrao: string): string {
    console.error(mensagemPadrao, error);
    const mensagemApi = typeof error.error === 'string'
      ? error.error
      : error.error?.message ?? error.error?.detail;

    return mensagemApi
      ? `${mensagemPadrao} ${mensagemApi}`
      : `${mensagemPadrao} (HTTP ${error.status}).`;
  }
}
