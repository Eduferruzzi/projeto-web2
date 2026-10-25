
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { User } from '../../models/user';
import { FuncionarioInput, FuncionarioService } from '../../services/funcionario-service';

@Component({
  selector: 'app-crudemployee',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-crud.html',
  styleUrl: './employee-crud.css',
})
export class CRUDemployee implements OnInit {
  funcionarios = signal<User[]>([]);
  funcionarioEditandoId: number | null = null;
  nome = '';
  email = '';
  dataNascimento = '';
  senha = '';
  confirmarSenha = '';
  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');
  mensagem = signal('');

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.funcionarioService.listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: funcionarios => {
          this.funcionarios.set(funcionarios);
        },
        error: error => {
          this.erro.set(this.mensagemErro(error));
        }
      });
  }

  adicionarFuncionario(formulario?: NgForm): void {
    if (formulario && formulario.invalid) {
      return;
    }

    if (this.salvando()) {
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro.set('As senhas devem coincidir.');
      return;
    }

    const funcionario: FuncionarioInput = {
      nome: this.nome.trim(),
      email: this.email.trim(),
      dataNascimento: this.dataNascimento,
      senha: this.senha
    };

    const idEmEdicao = this.funcionarioEditandoId;

    const requisicao = idEmEdicao === null
      ? this.funcionarioService.criar(funcionario)
      : this.funcionarioService.atualizar(idEmEdicao, funcionario);

    this.erro.set('');
    this.mensagem.set('');
    this.salvando.set(true);

    requisicao
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
        next: (funcionarioSalvo: User) => {
          if (idEmEdicao === null) {
            this.funcionarios.update(lista => [
              ...lista,
              funcionarioSalvo
            ]);

            this.mensagem.set('Funcionário cadastrado com sucesso.');

          } else {
            this.funcionarios.update(lista =>
              lista.map(funcionario =>
                funcionario.id === idEmEdicao
                  ? funcionarioSalvo
                  : funcionario
              )
            );

            this.mensagem.set('Funcionário atualizado com sucesso.');
          }

          this.limparFormulario();
          formulario?.resetForm();
        },

        error: error => {
          this.erro.set(this.mensagemErro(error));
        }
      });
  }

  editarFuncionario(funcionario: User): void {
    this.funcionarioEditandoId = funcionario.id;
    this.nome = funcionario.nome;
    this.email = funcionario.email;
    this.dataNascimento = funcionario.dataNascimento;
    this.senha = '';
    this.confirmarSenha = '';
    this.erro.set('');
    this.mensagem.set('');
  }

  excluirFuncionario(id: number): void {
    const alvo = this.funcionarios().find(
      funcionario => funcionario.id === id
    );

    if (!alvo) {
      return;
    }

    if (!window.confirm(
      `Deseja realmente remover ${alvo.nome} do cadastro?`
    )) {
      return;
    }
    this.erro.set('');
    this.mensagem.set('');
    this.funcionarioService.desativar(id).subscribe({
      next: () => {
        this.funcionarios.update(lista =>
          lista.filter(funcionario => funcionario.id !== id)
        );

        this.mensagem.set('Funcionário removido com sucesso.');

        if (this.funcionarioEditandoId === id) {
          this.limparFormulario();
        }
      },

      error: error => {
        this.erro.set(this.mensagemErro(error));
      }
    });
  }

  limparFormulario(): void {
    this.funcionarioEditandoId = null;
    this.nome = '';
    this.email = '';
    this.dataNascimento = '';
    this.senha = '';
    this.confirmarSenha = '';
  }

  private mensagemErro(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Não foi possível conectar à API. Verifique se o backend está em execução na porta 8081.';
      }
      if (error.status === 409) {
        return 'Já existe um funcionário cadastrado com este e-mail.';
      }
      if (error.status === 400) {
        return 'Confira os dados informados e tente novamente.';
      }
    }

    return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
