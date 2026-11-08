import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SolicitacaoService, LoginService } from '../../services'
import { Solicitacao, EstadoSolicitacao } from '../../models/Solicitacao'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-customer-home',
  imports: [ CommonModule, RouterLink],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome implements OnInit{
  private solicitacaoService = inject(SolicitacaoService)
  private loginService = inject(LoginService)
  private router = inject(Router)
  private solicitacaoCadastradaId = this.router.currentNavigation()?.extras.state?.['solicitacaoId']
  solicitacaoCadastrada = false
  solicitacoes: Solicitacao[] = []
  mensagem = ''
  mensagemSucesso = true

  ngOnInit(): void {
    const cliente = this.loginService.usuarioLogado
    if (cliente && cliente.perfil === 'CLIENTE' && cliente.id > 0) {
      this.solicitacaoService.listarPorCliente(cliente.id).subscribe({
        next: (solicitacoes) => {
          this.solicitacoes = this.ordenarPorData(solicitacoes)
          this.verificarSolicitacaoCadastrada()
        },
        error: (error) => {
          this.mensagem = 'Erro ao buscar solicitações do cliente.'
          this.mensagemSucesso = false
        }
      })
      this.solicitacaoCadastrada = this.solicitacoes.some(solicitacao => solicitacao.id === this.solicitacaoCadastradaId)
    }
  }

  private verificarSolicitacaoCadastrada(): void {
    if (this.solicitacaoCadastradaId) {
      this.solicitacaoCadastrada = this.solicitacoes.some(solicitacao => solicitacao.id === this.solicitacaoCadastradaId)
    }
  }

  private paraTimestamp(dataHora : string) : number{
    return new Date(dataHora).getTime();
  }

  private ordenarPorData(solicitacoes: Solicitacao[]): Solicitacao[] {
    return [...solicitacoes].sort((a, b) =>
      this.paraTimestamp(a.dataHora) - this.paraTimestamp(b.dataHora)
    );
  }

}
