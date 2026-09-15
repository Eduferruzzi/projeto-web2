import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CatEquipService } from '../../../services'
import { CatEquip } from '../../../models/cat-equip'

@Component({
  selector: 'app-list-categories',
  imports: [CommonModule, RouterModule],
  templateUrl: './list-categories.html',
  styleUrl: './list-categories.css',
})

export class ListCategories implements OnInit{
  private catEquipService = inject(CatEquipService)
  categories: CatEquip[] = []
  
  ngOnInit(): void {
    this.categories = this.catEquipService.listar()
  }

  remover($event:any, category: CatEquip) {
    $event.preventDefault()
    if(confirm(`Deseja mesmo deletar a categoria: ${ category.nome}?`)){
      this.catEquipService.remover(category.id)
      this.categories = this.catEquipService.listar()
    }
  }
}
