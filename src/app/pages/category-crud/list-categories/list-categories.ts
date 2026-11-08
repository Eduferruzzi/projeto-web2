import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CatEquipService } from '../../../services'
import { CatEquip } from '../../../models/cat-equip'
import { ConfirmModal } from '../../../components/confirm-modal'

@Component({
  selector: 'app-list-categories',
  imports: [CommonModule, RouterModule, ConfirmModal],
  templateUrl: './list-categories.html',
  styleUrl: './list-categories.css',
})

export class ListCategories implements OnInit{
  private catEquipService = inject(CatEquipService)
  categories = signal<CatEquip[]>([])
  carregando = signal(true)
  erro = signal('')
  categoriaParaRemover = signal<CatEquip | null>(null)
  
  ngOnInit(): void {
    this.carregarCategorias()
  }

  carregarCategorias(): void {
    this.carregando.set(true)
    this.erro.set('')
    this.catEquipService.listarNoBanco().subscribe({
      next: categories => {
        this.categories.set(categories)
        this.carregando.set(false)
      },
      error: () => {
        this.erro.set('Não foi possível carregar as categorias. Tente novamente mais tarde.')
        this.carregando.set(false)
      }
    })
  }

  abrirModalRemocao(category: CatEquip): void {
    this.categoriaParaRemover.set(category)
  }

  fecharModalRemocao(): void {
    this.categoriaParaRemover.set(null)
  }

  confirmarRemocao(): void {
    const category = this.categoriaParaRemover()
    if (!category) {
      return
    }

    this.catEquipService.remover(category.id).subscribe({
      next: () => {
        this.fecharModalRemocao()
        this.carregarCategorias()
      },
      error: () => {
        this.fecharModalRemocao()
        this.erro.set('Não foi possível remover a categoria. Tente novamente.')
      }
    })
  }
}
