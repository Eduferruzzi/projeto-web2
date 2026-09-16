import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../services'
import { Solicitacao } from '../../models/Solicitacao'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-customer-home',
  imports: [ CommonModule, RouterLink],
  templateUrl: './customer-home.html',
  styleUrl: './customer-home.css',
})
export class CustomerHome implements OnInit{
  private solicitacaoService = inject(SolicitacaoService)
  solicitacoes: Solicitacao[] = []

  ngOnInit(): void {
    this.solicitacoes = this.solicitacaoService.listar()
  }
}
