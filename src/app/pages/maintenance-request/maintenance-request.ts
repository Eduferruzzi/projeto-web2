import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatEquipService, SolicitacaoService, LoginService } from '../../services'
import { CatEquip } from '../../models/cat-equip'

@Component({
  selector: 'app-maintenance-request',
  imports: [FormsModule, RouterLink],
  templateUrl: './maintenance-request.html',
  styleUrl: './maintenance-request.css',
})
export class MaintenanceRequest implements OnInit {
  private catEquipService = inject(CatEquipService);
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  descricaoEquipamento = '';
  categoria = '';
  descricaoDefeito = '';
  
  solicitacaoEnviada = false;
  categorias = signal<CatEquip[]>([]);
  carregandoCategorias = signal(true);
  erroCategorias = signal('');

  ngOnInit(): void {
    this.catEquipService.listarNoBanco().subscribe({
      next: categorias => {
        this.categorias.set(categorias);
        this.carregandoCategorias.set(false);
      },
      error: () => {
        this.erroCategorias.set('Não foi possível carregar as categorias. Tente novamente mais tarde.');
        this.carregandoCategorias.set(false);
      }
    });
  }

  cadastrarSolicitacao(formulario: NgForm) {
    if (formulario.invalid) {
      return;
    }

    const cliente = this.loginService.usuarioLogado;
    if (!cliente || cliente.perfil !== 'CLIENTE' || !Number.isInteger(cliente.id) || cliente.id <= 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.solicitacaoService.cadastrar(
      this.descricaoEquipamento,
      this.categoria,
      this.descricaoDefeito,
      cliente.id,
      cliente.nome
    );

    this.solicitacaoEnviada = true;
    formulario.resetForm();
    this.router.navigate(['/user-home'])
  }
}
