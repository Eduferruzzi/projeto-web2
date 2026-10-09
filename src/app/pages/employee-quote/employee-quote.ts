import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Tela de orçamento. CommonModule fornece diretivas estruturais do template e FormsModule
// habilita o vínculo ngModel do valor informado pelo funcionário.
@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-quote.html',
  styleUrl: './employee-quote.css',
})
export class Budget {
  // APIs do Angular: ActivatedRoute lê o id enviado pela URL e Router realiza a navegação.
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // Serviço local que consulta a solicitação e registra o orçamento no fluxo da aplicação.
  private solicitacaoService = inject(SolicitacaoService);

  // undefined representa id inexistente ou solicitação não encontrada.
  solicitacao : Solicitacao | undefined;

  // null indica que o funcionário ainda não informou um valor; erroValor alimenta a mensagem
  // de validação exibida no template.
  ValorOrcamento: number | null = null;
  erroValor = '';

  // Nome temporário usado como responsável pelo orçamento até haver autenticação integrada.
  FuncionarioLogado = 'Temporario';

  // Obtém o parâmetro :id da rota, converte-o para number e procura a solicitação no serviço.
  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  // Valida a existência da solicitação e o valor antes de registrar e voltar ao painel.
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

  // Cancela o fluxo sem alterar a solicitação e retorna ao painel do funcionário.
  cancelar(){
    this.router.navigate(['/employee-home']);
  }
}
