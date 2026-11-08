import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { CatEquip } from '../../../models/cat-equip'
import { CatEquipService } from '../../../services'

@Component({
  selector: 'app-edit-categories',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-categories.html',
  styleUrl: './edit-categories.css',
})

export class EditCategories implements OnInit{
  @ViewChild('formCategory') form! : NgForm
  category = signal(new CatEquip())
  erro = signal('')

  private catEquipService = inject(CatEquipService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  
  ngOnInit(): void {
    let id:number = +this.route.snapshot.params['id']
    this.catEquipService.buscarPorId(id).subscribe({
      next: category => this.category.set(category),
      error: () => this.erro.set('Não foi possível carregar a categoria.')
    })
  }

  atualizar():void{
    if(this.form.form.valid){
      this.erro.set('')
      this.catEquipService.atualizar(this.category()).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: () => this.erro.set('Não foi possível atualizar a categoria. Tente novamente.')
      })
    }
  }
}
