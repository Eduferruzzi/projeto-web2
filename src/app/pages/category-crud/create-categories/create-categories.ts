import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { CatEquip } from '../../../models/cat-equip'
import { CatEquipService } from '../../../services'

@Component({
  selector: 'app-create-categories',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-categories.html',
  styleUrl: './create-categories.css',
})

export class CreateCategories {
  @ViewChild('formCategory') form! : NgForm
  category: CatEquip = new CatEquip()

  private catEquipService = inject(CatEquipService)
  private router = inject(Router)

  inserir():void {
    if(this.form.form.valid){
      this.catEquipService.inserir(this.category)
      this.router.navigate(['/categories'])
    }
  }
}
