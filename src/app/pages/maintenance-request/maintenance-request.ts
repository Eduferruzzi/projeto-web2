import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CatEquipService } from '../../services';
import { CatEquip } from '../../models/cat-equip';

@Component({
  selector: 'app-maintenance-request',
  imports: [FormsModule, RouterLink],
  templateUrl: './maintenance-request.html',
  styleUrl: './maintenance-request.css',
})
export class MaintenanceRequest implements OnInit {
  private catEquipService = inject(CatEquipService);
  private router = inject(Router);

  descricaoEquipamento = '';
  categoria = '';
  descricaoDefeito = '';

  solicitacaoEnviada = false;
  categorias: CatEquip[] = [];

  ngOnInit(): void {
    this.categorias = this.catEquipService.listar();
  }

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
    this.router.navigate(['/user-home'])
  }
}