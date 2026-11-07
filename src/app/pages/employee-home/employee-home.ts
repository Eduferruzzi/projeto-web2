import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitacaoService, SolicitacaoAbertaAPI } from '../../services/solicitacao-service';

@Component({
  selector: 'app-employee-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.css',
})

export class EmployeeHome implements OnInit {

  solicitacoes = signal<SolicitacaoAbertaAPI[]>([]);
  carregando = signal(true);
  erro= signal('');

  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    
    this.listarAbertas();
  
  }

  listarAbertas(): void{
    this.carregando.set(true);
    this.erro.set('');

    this.solicitacaoService.listarAbertasAPI().subscribe({
      next: (dados) => {
        this.solicitacoes.set(dados ?? []);
        this.carregando.set(false);
      },
      error: (error) => {
        this.erro.set('erro ao listar solicitações abertas.');
        this.carregando.set(false);
      }
    });

  }


  verif(text: string, limite: number = 30): string {
      return text.length > limite ? text.substring(0, limite) + '...' : text;
    }

}


