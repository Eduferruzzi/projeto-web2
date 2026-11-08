import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SolicitacaoService } from '../../services/solicitacao-service'; 
import { UserService } from '../../services/user-service'; 
import { Solicitacao } from '../../models/Solicitacao';
import { User } from '../../models/user';
import { LoginService } from '../../services'
import { EstadoSolicitacao } from '../../models/Solicitacao';

@Component({
  selector: 'app-execute-maintenance',
  imports: [CommonModule],
  templateUrl: './execute-maintenance.html',
  styleUrl: './execute-maintenance.css'
})
export class ExecuteMaintenance implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private solicitacaoService = inject(SolicitacaoService); 
  private userService = inject(UserService);
  private loginService = inject(LoginService);

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
    this.funcionarioId = this.loginService.usuarioLogado?.id;
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
      },
      error: (error) => {
        this.mensagem = 'Erro ao buscar a solicitação.';
        this.mensagemSucesso = false;
      }
    });

    // carrega os funcionarios menos vc mesmo
    this.funcionariosSelect.set(
      this.userService.listarTodos().filter(f => f.id !== this.funcionarioId)
    );
  }

  // valida campos, confirma e grava
  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao || !orientacoes) {
      alert('Por favor, preencha todos os campos da manutenção.');
      return;
    }
    if (confirm('Quer concluir esta manutenção?')) {
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
      this.solicitacaoService.alterarEstado(solicitacao.id, this.funcionarioId!, obs, status)
        .subscribe({
          next: () => this.router.navigate(['/employee-requests']),
          error: () => {
            this.mensagem = 'Erro ao concluir a manutenção.';
            this.mensagemSucesso = false;
          }
        });
    }
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
    if (confirm('Quer redirecionar esta manutenção para outro funcionário?')) {
      this.solicitacaoService.redirecionarManutencao(solicitacao.id, this.funcionarioId!, idFuncionarioDestino)
        .subscribe({
          next: () => this.router.navigate(['/employee-requests']),
          error: () => {
            this.mensagem = 'Erro ao redirecionar a manutenção.';
            this.mensagemSucesso = false;
          }
        });
    }
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
}