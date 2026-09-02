import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao-service';
import { Solicitacao } from '../../models/Solicitacao';

@Component({
  selector: 'app-budget',
  imports: [],
  templateUrl: './budget.html',
  styleUrl: './budget.css',
})
export class Budget {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao : Solicitacao | undefined;

  ValorOrcamento: number | null = null;
  erroValor = '';

  FuncionarioLogado = 'Temporario';

  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  confirmarOrcamento(){
    
    if(!this.solicitacao){
      return;
    }

    if(this.ValorOrcamento === null || this.ValorOrcamento <=0){
      this.erroValor = 'Informe um valor valido senhor por favor';
      return;
    }

    this.solicitacaoService.efetuarOrcamento(
      this.solicitacao.id,
      this.ValorOrcamento,
      this.FuncionarioLogado
    );

    this.router.navigate(['/employee-home']);

  }

  cancelar(){
    this.router.navigate(['/employee-home']);
  }
}
