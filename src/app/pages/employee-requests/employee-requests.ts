import { ConfirmModal } from '../../components/confirm-modal';
import { ViewChild, Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService, SolicitacaoService } from '../../services';
import { Solicitacao } from '../../models/Solicitacao'

// Limita o estado do filtro às opções oferecidas pelos controles do template.
type FiltroTipo = 'HOJE' | 'PERIODO' | 'TODAS';

// CommonModule fornece diretivas e pipes do template, RouterLink habilita navegação
// para outras telas e FormsModule conecta os campos de data às propriedades do componente.
@Component({
  selector: 'app-employee-requests',
  imports: [ConfirmModal, CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-requests.html',
  styleUrls: ['./employee-requests.css']
})
export class EmployeeRequests implements OnInit {
  @ViewChild(ConfirmModal) modal!: ConfirmModal;
  // dados da API
  solicitacoes = signal<Solicitacao[]>([]);

  //controle interface
  carregando = signal(false);
  erro = signal('');
  funcId: number | null = null;

  somenteAtribuidas = signal(true);

  // filtros de 
  filtroAtivo = signal<FiltroTipo>('HOJE');
  dataInicio = signal('');
  dataFim = signal('');
  
  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);
  
ngOnInit(): void {

  const id = Number(this.loginService.usuarioLogado?.id);

  if (!Number.isInteger(id) || id <= 0) {
    this.funcId = null;
    this.erro.set('Funcionário não identificado.');
    return;
}

  this.funcId = id;

  this.carregarSolicitacoes();
}

  //consultar as solicitações abertas
carregarSolicitacoes(): void {

  if (!this.funcId) {
    this.erro.set('Funcionário não identificado.');
    this.solicitacoes.set([]);
    return;
  }

  this.carregando.set(true);
  this.erro.set('');

  const consulta = this.somenteAtribuidas()
    ? this.solicitacaoService.listarAtribuidas(this.funcId)
    : this.solicitacaoService.listarVisiveis(this.funcId);

  consulta.subscribe({

    next: (dados) => {
      this.solicitacoes.set(dados ?? []);
      this.carregando.set(false);
    },

    error: () => {
      this.erro.set('Não foi possível carregar as solicitações.');
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

      if(filtro == "TODAS"){
        return true;
      }

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

  finalizarSolicitacao(solicitacaoId: number) {
    this.erro.set('');
    if (!this.funcId) {
      this.erro.set('ID do funcionário inválido.');
      this.carregando.set(false);
      return;
    }
    this.modal.abrir('Tem certeza que deseja finalizar a solicitação?', () => {
      this.carregando.set(true);
      this.solicitacaoService.alterarEstado(solicitacaoId, this.funcId!, 'Finalizado pelo funcionário', 'FINALIZADA').subscribe({
        next: (solicitacao) => {
          this.carregarSolicitacoes();
          this.carregando.set(false);
        },
        error: (err) => {
          this.erro.set('Erro ao finalizar solicitação: ' + err.message);
          this.carregando.set(false);
        }
      });
    });
  }

  alterarListagem(somenteMinhas: boolean): void {

    if (this.somenteAtribuidas() === somenteMinhas) {
      return;
    }

    this.somenteAtribuidas.set(somenteMinhas);

    this.carregarSolicitacoes();
  }
}