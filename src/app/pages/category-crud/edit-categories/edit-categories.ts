import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  category: CatEquip = new CatEquip()

  private catEquipService = inject(CatEquipService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  
  ngOnInit(): void {
    let id:number = +this.route.snapshot.params['id']
    const res = this.catEquipService.buscarPorId(id)
    if(res !== undefined)
      this.category = res
    else
      throw new Error ("Categoria não encontrada: id = " + id)
  }

  atualizar():void{
    if(this.form.form.valid){
      this.catEquipService.atualizar(this.category)
      this.router.navigate(['/categories'])
    }
  }
}
