import { Component, inject, OnInit } from '@angular/core';
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
  solicitacao: Solicitacao | undefined; 
  funcionariosSelect: User[] = [];
  
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
        this.solicitacao = solicitacao;
      },
      error: (error) => {
        this.mensagem = 'Erro ao buscar a solicitação.';
        this.mensagemSucesso = false;
      }
    });

    // carrega os funcionarios menos vc mesmo
    this.funcionariosSelect = this.userService.listarTodos().filter(f => f.id !== this.funcionarioId);
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
      if (!this.solicitacao) {
        this.mensagem = 'Solicitação não encontrada.';
        this.mensagemSucesso = false;
        return;
      }
      if (!this.funcionarioId) {
        this.mensagem = 'ID do funcionário inválido.';
        this.mensagemSucesso = false;
        return;
      }
      this.solicitacaoService.alterarEstado(this.solicitacao!.id, this.funcionarioId!, obs, status);
      this.router.navigate(['/employee-requests']);
    }
  }

  // valida seleção, confirma e grava
  redirecionarManutencao(funcionarioId: string): void {
    if (!this.solicitacao) {
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
      this.solicitacaoService.redirecionarManutencao(this.solicitacao!.id, this.funcionarioId!, idFuncionarioDestino);
      this.router.navigate(['/employee-requests']);
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