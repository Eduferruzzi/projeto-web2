import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatEquipService, SolicitacaoService, LoginService, SolicitacaoInput } from '../../services'
import { CatEquip } from '../../models/cat-equip'
import { Solicitacao } from '../../models/Solicitacao'
import { HttpErrorResponse } from '@angular/common/http'
import { finalize } from 'rxjs'

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
  categoria: CatEquip = new CatEquip();
  descricaoDefeito = '';
  solicitacaoId: number = 0
  
  solicitacaoEnviada = false;
  categorias = signal<CatEquip[]>([]);
  carregandoCategorias = signal(true);
  erroCategorias = signal('');

  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');

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

    const solicitacaoInput: SolicitacaoInput = {
      clienteId: cliente.id,
      categoriaId: this.categoria.id,
      descricaoEquipamento: this.descricaoEquipamento,
      descricaoDefeito: this.descricaoDefeito
    }

    const requisicao = this.solicitacaoService.cadastrar(solicitacaoInput)
    
    this.erro.set('');
    this.salvando.set(true);

    requisicao
    .pipe(finalize(() => this.salvando.set(false)))
    .subscribe(
      {
        next: (solicitacaoSalva: Solicitacao) => {
          this.solicitacaoEnviada = true;
          formulario.resetForm();
          this.router.navigate(['/user-home'], { state: { solicitacaoId: solicitacaoSalva.id } })
        },
        error: error => {
            this.erro.set(this.mensagemErro(error));
        }
      }
    );

  }

  private mensagemErro(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Não foi possível conectar à API. Verifique se o backend está em execução na porta 8080.';
      }
      if (error.status === 400) {
        return 'Confira os dados informados e tente novamente.';
      }
    }
    return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
