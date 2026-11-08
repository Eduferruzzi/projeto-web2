import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitacaoService } from '../../services/solicitacao-service';

import { LoginService } from '../../services/login.service';
import { Solicitacao } from '../../models/Solicitacao'

@Component({
  selector: 'app-budget',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-quote.html',
  styleUrl: './employee-quote.css',
})
export class Budget implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private solicitacaoService = inject(SolicitacaoService);
  private loginService = inject(LoginService);

  solicitacao = signal<Solicitacao | null>(null);

  carregando = signal(true);
  salvando = signal(false);
  erro = signal('');

  valorOrcamento: number | null = null;
  erroValor = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.erro.set('Identificador da solicitação inválido.');
      this.carregando.set(false);
      return;
    }

    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (dados) => {
        if (dados.estado !== 'ABERTA') {
          this.erro.set(
            'Esta solicitação não está disponível para orçamento.'
          );
        } else {
          this.solicitacao.set(dados);
        }

        this.carregando.set(false);
      },

      error: () => {
        this.erro.set('Não foi possível carregar a solicitação.');
        this.carregando.set(false);
      }
    });
  }

  confirmarOrcamento(): void {

    const solicitacao = this.solicitacao();

    if (!solicitacao || this.salvando()) {
      return;
    }

    this.erroValor = '';
    this.erro.set('');
    const valor = this.valorOrcamento;

    if (
      valor === null ||
      !Number.isFinite(valor) ||
      valor <= 0 ||
      valor > 99999999.99 ||
      Math.abs(valor * 100 - Math.round(valor * 100)) > 0.000001
    ) {
      this.erroValor =
        'Informe um valor positivo com até duas casas decimais.';
      return;
    }

    const usuario = this.loginService.usuarioLogado;

    if (
      !usuario ||
      usuario.perfil !== 'FUNCIONARIO' ||
      !Number.isInteger(usuario.id) ||
      usuario.id <= 0
    ) {
      this.erro.set(
        'Funcionário não identificado. Faça login novamente.'
      );
      return;
    }

    this.salvando.set(true);

    this.solicitacaoService.efetuarOrcamento(
      solicitacao.id,
      usuario.id,
      valor
    ).subscribe({

      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/employee-requests']);
      },

      error: (erro: HttpErrorResponse) => {
        this.salvando.set(false);

        if (erro.status === 409) {
          this.erro.set(
            'Esta solicitação já foi alterada e não pode ser orçada.'
          );
          this.solicitacao.set(null);

        } else if (erro.status === 400) {
          this.erro.set('O valor informado é inválido.');

        } else if (erro.status === 404) {
          this.erro.set(
            'Solicitação ou funcionário não encontrado.'
          );

        } else {
          this.erro.set(
            'Não foi possível registrar o orçamento.'
          );
        }
      }

    });
  }

  cancelar(): void {
    this.router.navigate(['/employee-requests']);
  }
}