import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Solicitacao } from '../../models/Solicitacao';
import { SolicitacaoService } from '../../services';

// Painel do funcionário: o template apresenta solicitações abertas e usa RouterLink
// para encaminhar cada item à tela de orçamento, passando o id pela URL.
@Component({
  selector: 'app-employee-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.css',
})
export class EmployeeHome implements OnInit {
  // Array tipado pelo modelo da aplicação e consumido pelo *ngFor do template.
  solicitacoes: Solicitacao[] = [];

  // Serviço compartilhado que consulta as solicitações e as mantém no estado da aplicação.
  constructor(private solicitacaoService: SolicitacaoService) {}

  // Busca apenas as solicitações cujo estado atual é ABERTA.
  ngOnInit(): void {
    this.solicitacoes = this.solicitacaoService.listarAbertas();
  }

  // Encurta descrições longas para manter a tabela legível; limite padrão de 30 caracteres.
  verif(text: string, limite: number = 30): string {
    return text.length > limite ? text.substring(0, limite) + '...' : text;
  }
}
