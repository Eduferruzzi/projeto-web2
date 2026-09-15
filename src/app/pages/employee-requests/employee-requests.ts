import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';

type FiltroTipo = 'HOJE' | 'PERIODO' | 'TODAS';

@Component({
  selector: 'app-employee-requests',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-requests.html',
  styleUrls: ['./employee-requests.css']
})
export class EmployeeRequests implements OnInit {

  todasSolicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];

  filtroAtivo: FiltroTipo = 'HOJE';
  dataInicio: string = '';
  dataFim: string = '';

  nomeFuncionarioLogado = 'Temporario';

  constructor(private solicitacaoService: SolicitacaoService) {}

  ngOnInit(): void {
    this.todasSolicitacoes = this.solicitacaoService.listar();
    this.aplicarFiltro();
  }

  onFiltroChange(filtro: FiltroTipo): void {
    this.filtroAtivo = filtro;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    if (this.filtroAtivo === 'HOJE') {
      const hoje = new Date();
      this.solicitacoesFiltradas = this.todasSolicitacoes.filter((s) => {
        const data = this.parseDataHora(s.dataHora);
        return data.getDate() === hoje.getDate()
          && data.getMonth() === hoje.getMonth()
          && data.getFullYear() === hoje.getFullYear();
      });
      this.solicitacoesFiltradas = this.ordenarPorData(this.solicitacoesFiltradas);
      return;
    }

    if (this.filtroAtivo === 'PERIODO') {
      const inicio = this.dataInicio ? new Date(this.dataInicio + 'T00:00:00') : null;
      const fim = this.dataFim ? new Date(this.dataFim + 'T23:59:59') : null;

      this.solicitacoesFiltradas = this.todasSolicitacoes.filter((s) => {
        const data = this.parseDataHora(s.dataHora);
        if (inicio && data < inicio) return false;
        if (fim && data > fim) return false;
        return true;
      });
      this.solicitacoesFiltradas = this.ordenarPorData(this.solicitacoesFiltradas);
      return;
    }

    this.solicitacoesFiltradas = this.ordenarPorData(this.todasSolicitacoes);
  }

  private ordenarPorData(solicitacoes: Solicitacao[]): Solicitacao[] {
    return [...solicitacoes].sort((a, b) =>
      this.parseDataHora(b.dataHora).getTime() - this.parseDataHora(a.dataHora).getTime()
    );
  }

  
  finalizar(id: number): void {
    if (confirm('Você quer finalizar esta solicitação?')) {
      this.solicitacaoService.finalizarSolicitacao(id, this.nomeFuncionarioLogado);
      this.aplicarFiltro(); 
    }
  }

  private parseDataHora(dataHora: string): Date {
    const [data, hora] = dataHora.split(' ');
    const [dia, mes, ano] = data.split('/');
    const [horaNum, minuto] = hora.split(':');
    return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(horaNum), Number(minuto));
  }
}