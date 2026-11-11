import { Component, inject } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao-service';
import { formatarMoedaBr } from '../../shared';
import autoTable, { UserOptions } from 'jspdf-autotable'
import jsPDF from 'jspdf'
import { Solicitacao } from '../../models/Solicitacao'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})

export class Reports {
  private solicitacaoService = inject(SolicitacaoService);
  mostrarDatas = false;
  mensagem = '';

  exibirDatas(): void {
    this.mostrarDatas = true;
  }

  async baixarRelatorio(tipo: 'data' | 'categoria', inicio = '', fim = ''): Promise<void> {
    this.mensagem = '';

    if (tipo === 'data' && inicio && fim && inicio > fim) {
      this.mensagem = 'A data inicial não pode ser posterior à data final.';
      return;
    }

    const receitas: Record<string, Solicitacao[]> = {};
    let total = 0;

    let solicitacoes: Solicitacao[];

    try {
      solicitacoes = await firstValueFrom<Solicitacao[]>(this.solicitacaoService.listarReceitas());
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      this.mensagem = 'Erro ao buscar solicitações.';
      return;
    }

    for (const solicitacao of solicitacoes) {
      if (
        !solicitacao.dataHoraPagamento || 
        (solicitacao.estado !== 'FINALIZADA' && solicitacao.estado !== 'PAGA') ||
        !solicitacao.valorOrcamento
      ) {
        continue;
      }

      let grupo = solicitacao.categoria;

      if (tipo === 'data') {
        const dataPagamento = new Date(solicitacao.dataHoraPagamento);

        if (Number.isNaN(dataPagamento.getTime())) {
          continue;
        }

        const data =
          `${dataPagamento.getFullYear()}-` +
          `${String(dataPagamento.getMonth() + 1).padStart(2, '0')}-` +
          `${String(dataPagamento.getDate()).padStart(2, '0')}`;

        if (inicio && data < inicio) {
          continue;
        }
        if (fim && data > fim) {
          continue;
        }
        grupo = data;
      }

      const valor = solicitacao.valorOrcamento ?? 0;
      (receitas[grupo] ??= []).push(solicitacao);
      total += valor;
    }

    const pdf = new jsPDF()
    const larguraPagina = pdf.internal.pageSize.getWidth()
    const centroX = larguraPagina/2

    // Título
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    pdf.text(`Receitas por ${tipo}`, centroX, 20, {align: 'center'})
    
    // Subtítulo
    const partesSubtitulo: string[] = []
    if (inicio){
      partesSubtitulo.push(`A partir de ${this.formatarData(inicio)}`)
    }

    if (fim){
      partesSubtitulo.push(`Até ${this.formatarData(fim)}`)
    }
    
    // Só tem subtítulo se alguma data for informada
    if(partesSubtitulo.length > 0){
      const subtitulo = partesSubtitulo.join('. ')

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.text(subtitulo, centroX, 26, {align: 'center'})
    }

    // Linha decorativa
    pdf.setDrawColor(220,224,230)
    pdf.setLineWidth(0.5)
    pdf.line(14, 32, 196, 32)
    
    // Tabela das receitas
    const colunaTipo = tipo.toUpperCase()
    const colunas = [colunaTipo, 'CLIENTE', tipo === 'data' ? 'CATEGORIA' : 'DATA DO PAGAMENTO', 'VALOR (R$)']
    const grupos = Object.keys(receitas).sort();
    const linhas: string[][] = [];
    for (const grupo of grupos) {
      let subtotal = 0;
      for (const solicitacao of receitas[grupo]) {
        const valor = solicitacao.valorOrcamento ?? 0;
        linhas.push([
          tipo === 'data' ? this.formatarData(grupo) : grupo,
          solicitacao.cliente ?? 'Não informado',
          tipo === 'data' ? solicitacao.categoria : this.formatarData(solicitacao.dataHoraPagamento!.slice(0, 10)),
          formatarMoedaBr(valor)
        ]);
        subtotal += valor;
      }
      linhas.push(['Subtotal', '', '', formatarMoedaBr(subtotal)]);
    }

    const opcoesTabela: UserOptions = {
      startY: 38,
      margin: { left: 14, right: 14 },
      head: [colunas],
      body: linhas,
      foot: [['Total geral', '', '', formatarMoedaBr(total)]],
      showFoot: 'lastPage',
      footStyles: { fillColor: [41, 128, 185], halign: 'right' },
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 48 },
        3: { cellWidth: 32, halign: 'right' },
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3
      }
    }

    autoTable(pdf, opcoesTabela)

    pdf.save(`receitas-por-${tipo}.pdf`);
  }

  private formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
