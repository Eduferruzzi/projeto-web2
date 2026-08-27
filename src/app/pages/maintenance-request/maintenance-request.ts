import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-maintenance-request',
  imports: [FormsModule, RouterLink],
  templateUrl: './maintenance-request.html',
  styleUrl: './maintenance-request.css',
})
export class MaintenanceRequest {
  descricaoEquipamento = '';
  categoria = '';
  descricaoDefeito = '';

  solicitacaoEnviada = false;

  categorias = [
    'Notebooks',
    'Desktop',
    'Impressora',
    'Mouse',
    'Teclado',
  ];

  cadastrarSolicitacao(formulario: NgForm) {
    if (formulario.invalid) {
      return;
    }

    const solicitacao = {
      descricaoEquipamento: this.descricaoEquipamento,
      categoria: this.categoria,
      descricaoDefeito: this.descricaoDefeito,
      dataHora: new Date(),
      estado: 'ABERTA',
    };


    this.solicitacaoEnviada = true;
    formulario.resetForm();
  }
}