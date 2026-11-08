import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao'

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

  // dados da API
  solicitacoes = signal<Solicitacao[]>([]);

  //controle interface
  carregando = signal(false);
  erro = signal('');

  // filtros de 
  filtroAtivo = signal<FiltroTipo>('HOJE');
  dataInicio = signal('');
  dataFim = signal('');

  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  //consultar as solicitações abertas
  carregarSolicitacoes() {
    this.carregando.set(true);
    this.erro.set('');

    this.solicitacaoService.listarAbertas().subscribe({
      next: (dados) => {
        this.solicitacoes.set(dados ?? []);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar solicitações: ' + err.message);
        this.carregando.set(false);
      }
    });
  }

  // filtrar com signal
  solicitacoesFiltradas = computed(() => {
    const filtro = this.filtroAtivo();
    const inicioTexto = this.dataInicio();
    const fimTexto = this.dataFim();

    const hoje = new Date();
    const inicio = inicioTexto ? new Date(`${inicioTexto}T00:00:00`) : null;
    const fim = fimTexto ? new Date(`${fimTexto}T23:59:59`) : null;

    return this.solicitacoes().filter(solicitacao => {
      const data = new Date(solicitacao.dataHora);

      if(Number.isNaN(data.getTime())) {
        return false;
      }

      if (filtro === 'HOJE') {
          return data.getDate() === hoje.getDate()
            && data.getMonth() === hoje.getMonth()
            && data.getFullYear() === hoje.getFullYear();
        }

        if (filtro === 'PERIODO') {
          if (inicio && data < inicio) return false;
          if (fim && data > fim) return false;
        }

        return true;
      })
      .sort((a, b) =>
        new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
      );
  });
}