import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao';

// Limita o estado do filtro às opções oferecidas pelos controles do template.
type FiltroTipo = 'HOJE' | 'PERIODO' | 'TODAS';

// CommonModule fornece diretivas e pipes do template, RouterLink habilita navegação
// para outras telas e FormsModule conecta os campos de data às propriedades do componente.
@Component({
  selector: 'app-employee-requests',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-requests.html',
  styleUrls: ['./employee-requests.css']
})
export class EmployeeRequests implements OnInit {

  // Lista original vinda do serviço e resultado atualizado conforme o filtro selecionado.
  todasSolicitacoes: Solicitacao[] = [];
  solicitacoesFiltradas: Solicitacao[] = [];

  // Estado dos controles de filtro e datas escolhidas no template via ngModel.
  filtroAtivo: FiltroTipo = 'HOJE';
  dataInicio: string = '';
  dataFim: string = '';

  // Identificação temporária enviada ao serviço ao finalizar uma solicitação.
  nomeFuncionarioLogado = 'Temporario';

  // Serviço compartilhado que fornece e atualiza as solicitações da aplicação.
  constructor(private solicitacaoService: SolicitacaoService) {}

  // Carrega os dados iniciais e calcula a lista exibida pela tela.
  ngOnInit(): void {
    this.todasSolicitacoes = this.solicitacaoService.listar();
    this.aplicarFiltro();
  }

  // Atualiza a opção ativa e refaz a filtragem após a escolha do usuário.
  onFiltroChange(filtro: FiltroTipo): void {
    this.filtroAtivo = filtro;
    this.aplicarFiltro();
  }

  // Filtra por hoje, pelo intervalo informado ou mantém todas; cada resultado é ordenado por data.
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

  // Ordena sem modificar o array recebido, retornando as solicitações da mais antiga à mais nova.
  private ordenarPorData(solicitacoes: Solicitacao[]): Solicitacao[] {
    return [...solicitacoes].sort((a, b) =>
      this.parseDataHora(a.dataHora).getTime() - this.parseDataHora(b.dataHora).getTime()
    );
  }

  // Finaliza uma solicitação paga após confirmação e reaplica o filtro para atualizar a tabela.
  finalizar(id: number): void {
    if (confirm('Você quer finalizar esta solicitação?')) {
      this.solicitacaoService.finalizarSolicitacao(id, this.nomeFuncionarioLogado);
      this.aplicarFiltro(); 
    }
  }

  // Converte a data textual do modelo (DD/MM/AAAA HH:mm) para Date para comparar e ordenar.
  private parseDataHora(dataHora: string): Date {
    const [data, hora] = dataHora.split(' ');
    const [dia, mes, ano] = data.split('/');
    const [horaNum, minuto] = hora.split(':');
    return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(horaNum), Number(minuto));
  }
}