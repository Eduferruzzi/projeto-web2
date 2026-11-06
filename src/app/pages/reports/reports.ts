import { Component, inject } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao-service';
import { formatarMoedaBr } from '../../shared';
import autoTable, { UserOptions } from 'jspdf-autotable'
import jsPDF from 'jspdf'

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})

export class Reports {
  private solicitacaoService = inject(SolicitacaoService);
  mostrarDatas = false;
  erroPeriodo = '';

  exibirDatas(): void {
    this.mostrarDatas = true;
  }

  async baixarRelatorio(tipo: 'data' | 'categoria', inicio = '', fim = ''): Promise<void> {
    this.erroPeriodo = '';

    if (tipo === 'data' && inicio && fim && inicio > fim) {
      this.erroPeriodo = 'A data inicial não pode ser posterior à data final.';
      return;
    }

    const { jsPDF } = await import('jspdf');
    const receitas: Record<string, number> = {};
    let total = 0;

    const solicitacoes = [
      ...this.solicitacaoService.listar(),
      { categoria: 'Notebook', valorOrcamento: 350, dataHoraPagamento: '15/09/2026 16:00' },
      { categoria: 'Impressora', valorOrcamento: 180, dataHoraPagamento: '14/09/2026 16:00' },
      { categoria: 'Notebook', valorOrcamento: 420, dataHoraPagamento: '14/09/2026 16:00' },
    ];

    for (const solicitacao of solicitacoes) {
      if (!solicitacao.dataHoraPagamento) {
        continue;
      }

      let grupo = solicitacao.categoria;

      if (tipo === 'data') {
        const dataPagamento = solicitacao.dataHoraPagamento.split(' ')[0];
        const [dia, mes, ano] = dataPagamento.split('/');
        const data = `${ano}-${mes}-${dia}`;

        if (inicio && data < inicio) {
          continue;
        }
        if (fim && data > fim) {
          continue;
        }
        grupo = data;
      }

      const valor = solicitacao.valorOrcamento ?? 0;
      receitas[grupo] = (receitas[grupo] ?? 0) + valor;
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
      partesSubtitulo.push(`Apartir de ${this.formatarData(inicio)}`)
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
    const colunas = [colunaTipo, 'VALOR(R$)']
    const grupos = Object.keys(receitas).sort();
    const linhas = grupos.map((grupo)=> [
      tipo==='data'? this.formatarData(grupo) : grupo,
      formatarMoedaBr(receitas[grupo])
    ])

    const larguraTabela = 55
    const margemEsquerda = (larguraPagina - larguraTabela)/2

    const opcoesTabela: UserOptions = {
      startY: 38,
      margin: { left: margemEsquerda },
      head: [colunas],
      body: linhas,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 30, halign: 'right' },
      },
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3
      }
    }

    autoTable(pdf, opcoesTabela)

    // Total, final da tabela
    const finalY = (pdf as Record<string, any>)['lastAutoTable']?.finalY ?? 32 

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text(`Receita Total: ${formatarMoedaBr(total)}`, centroX, finalY + 10, { 
      align: 'center'
    })

    //TODO: arrumar o total

    pdf.save(`receitas-por-${tipo}.pdf`);
  }

  private formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
