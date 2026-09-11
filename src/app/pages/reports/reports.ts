import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  mostrarDatas = false;

  exibirDatas(): void {
    this.mostrarDatas = true;
  }
}
