import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';

// RF008 - Visualizar Servico: dados completos + historico de alteracoes
@Component({
  selector: 'app-view-service',
  imports: [CommonModule],
  templateUrl: './view-service.html',
  styleUrl: './view-service.css',
})
export class ViewService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao : Solicitacao | undefined;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitacao = this.solicitacaoService.buscarPorId(id);
  }

  // Botao de acao muda conforme o estado atual (regras do RF003)
  aprovarOuRejeitar() {
    this.router.navigate(['/quote', this.solicitacao?.id]);
  }

  // RF010 - Pagar Servico
  pagar() {
    this.router.navigate(['/payment']);
  }

  voltar() {
    this.router.navigate(['/user-home']);
  }

  formatarValor(valor : number | null) : string {
    if (valor === null) {
      return 'Ainda não orçado';
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Cores do RF013 reaproveitadas para o badge de estado
  corDoEstado(estado : string) : string {
    switch (estado) {
      case 'ABERTA': return 'text-bg-secondary';
      case 'ORCADA': return 'text-bg-warning';
      case 'REJEITADA': return 'text-bg-danger';
      case 'APROVADA': return 'text-bg-warning';
      case 'REDIRECIONADA': return 'text-bg-info';
      case 'ARRUMADA': return 'text-bg-primary';
      case 'PAGA': return 'text-bg-warning';
      case 'FINALIZADA': return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }
}
