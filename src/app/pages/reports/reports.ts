import { Component, inject } from '@angular/core';
import { SolicitacaoService } from '../../services/solicitacao-service';
import { formatarMoedaBr } from '../../shared';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  private solicitacaoService = inject(SolicitacaoService);
  mostrarDatas = false;

  exibirDatas(): void {
    this.mostrarDatas = true;
  }

  async baixarRelatorio(tipo: 'data' | 'categoria', inicio = '', fim = ''): Promise<void> {
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

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`Receitas por ${tipo}`, 20, 20);
    pdf.setFontSize(12);
    const linhas: string[] = [];
    const grupos = Object.keys(receitas).sort();

    for (const grupo of grupos) {
      let descricao = grupo;
      if (tipo === 'data') {
        descricao = this.formatarData(grupo);
      }
      linhas.push(`${descricao}: ${formatarMoedaBr(receitas[grupo])}`);
    }

    if (linhas.length === 0) {
      linhas.push('Nenhuma receita no periodo.');
    }
    linhas.push(`Total: ${formatarMoedaBr(total)}`);

    let altura = 45;
    for (const linha of linhas) {
      if (altura > 275) {
        pdf.addPage();
        altura = 20;
      }
      pdf.text(linha, 20, altura);
      altura += 10;
    }
    pdf.save(`receitas-por-${tipo}.pdf`);
  }

  private formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
