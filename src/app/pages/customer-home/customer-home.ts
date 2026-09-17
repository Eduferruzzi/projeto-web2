import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../services'
import { Solicitacao, EstadoSolicitacao } from '../../models/Solicitacao'
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
    this.solicitacoes = this.ordenarPorData(this.solicitacaoService.listar())
  }

  private parseDataHora(dataHora: string): Date {
    const [data, hora] = dataHora.split(' ');
    const [dia, mes, ano] = data.split('/');
    const [horaNum, minuto] = hora.split(':');
    return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(horaNum), Number(minuto));
  }

  private ordenarPorData(solicitacoes: Solicitacao[]): Solicitacao[] {
    return [...solicitacoes].sort((a, b) =>
      this.parseDataHora(a.dataHora).getTime() - this.parseDataHora(b.dataHora).getTime()
    );
  }

}
