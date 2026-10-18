import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { User } from '../../models/user';
import { FuncionarioInput, FuncionarioService } from '../../services/funcionario-service';
import { Numerico } from '../../shared';

// Tela de cadastro, edição e remoção de funcionários. CommonModule disponibiliza diretivas
// usadas no template; FormsModule habilita ngForm/ngModel; Numerico é uma diretiva local.
@Component({
  selector: 'app-crudemployee',
  imports: [CommonModule, FormsModule, Numerico],
  templateUrl: './employee-crud.html',
  styleUrl: './employee-crud.css',
})
export class CRUDemployee implements OnInit {
  funcionarios: User[] = [];
  funcionarioEditandoId: number | null = null;
  nome = '';
  email = '';
  dataNascimento = '';
  senha = '';
  confirmarSenha = '';
  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';

  constructor(private funcionarioService: FuncionarioService) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.carregando = true;
    this.erro = '';
    this.funcionarioService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: funcionarios => this.funcionarios = funcionarios,
        error: error => this.erro = this.mensagemErro(error)
      });
  }

  adicionarFuncionario(formulario?: NgForm): void {
    if (formulario && formulario.invalid) {
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas devem coincidir.';
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

    this.erro = '';
    this.mensagem = '';
    this.salvando = true;
    requisicao.pipe(finalize(() => this.salvando = false)).subscribe({
      next: () => {
        if (idEmEdicao === null) {
          this.mensagem = 'Funcionário cadastrado com sucesso.';
        } else {
          this.mensagem = 'Funcionário atualizado com sucesso.';
        }
        this.limparFormulario();
        this.carregarFuncionarios();
      },
      error: error => this.erro = this.mensagemErro(error)
    });
  }

  editarFuncionario(funcionario: User): void {
    this.funcionarioEditandoId = funcionario.id;
    this.nome = funcionario.nome;
    this.email = funcionario.email;
    this.dataNascimento = funcionario.dataNascimento;
    this.senha = '';
    this.confirmarSenha = '';
    this.erro = '';
    this.mensagem = '';
  }

  excluirFuncionario(id: number): void {
    const alvo = this.funcionarios.find((funcionario) => funcionario.id === id);
    if (!alvo) {
      return;
    }

    if (!window.confirm(`Deseja realmente remover ${alvo.nome} do cadastro?`)) {
      return;
    }

    this.erro = '';
    this.mensagem = '';
    this.funcionarioService.desativar(id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter(funcionario => funcionario.id !== id);
        this.mensagem = 'Funcionário removido com sucesso.';
        if (this.funcionarioEditandoId === id) {
          this.limparFormulario();
        }
      },
      error: error => this.erro = this.mensagemErro(error)
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
