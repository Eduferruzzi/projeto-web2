import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { SolicitacaoService } from '../../services/solicitacao-service'; 
import { UserService } from '../../services/user-service'; 
import { Solicitacao } from '../../models/Solicitacao';
import { User } from '../../models/user';

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

  // variaveis de estado do componente
  solicitacao: Solicitacao | undefined; 
  funcionariosSelect: User[] = [];
  
  // só um mock (peguei o mesmo do q tava no requests)
  nomeFuncionarioLogado = 'Eduardo'; 


  // flag p controle de exibição
  exibirRedirecionamento: boolean = false;
  exibirFormConclusao: boolean = true;

  // busca a solicitacao com base no id da url p inicializar os dados
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);

    // carrega os funcionarios menos vc mesmo
    this.funcionariosSelect = this.userService.listarTodos().filter(f => f.nome !== this.nomeFuncionarioLogado);
  }

  // valida campos, confirma e grava
  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao || !orientacoes) {
      alert('Por favor, preencha todos os campos da manutenção.');
      return;
    }
    if (confirm('Quer concluir esta manutenção?')) {
      this.solicitacaoService.efetuarManutencao(this.solicitacao!.id, descricao, orientacoes, this.nomeFuncionarioLogado);
      this.router.navigate(['/employee-requests']);
    }
  }

  // valida seleção, confirma e grava
  redirecionarManutencao(funcionarioId: string): void {
    if (!funcionarioId) {
      alert('Selecione um funcionário para o redirecionamento.');
      return;
    }
    if (confirm('Quer redirecionar esta manutenção para outro funcionário?')) {
      const funcionarioDestino = this.userService.buscarPorId(Number(funcionarioId));
      if(funcionarioDestino) {
          this.solicitacaoService.redirecionarManutencao(this.solicitacao!.id, this.nomeFuncionarioLogado, funcionarioDestino.nome);
      }
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