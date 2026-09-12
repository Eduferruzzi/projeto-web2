import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services';

@Component({
  selector: 'app-crudemployee',
  imports: [CommonModule, FormsModule, RouterLink],
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.funcionarios = this.userService.listarTodos();
  }

  adicionarFuncionario(formulario?: NgForm): void {
    if (formulario && formulario.invalid) {
      return;
    }

    if (!this.nome.trim()) {
      return;
    }

    if (this.senha.trim() && this.senha !== this.confirmarSenha) {
      return;
    }

    if (this.funcionarioEditandoId !== null) {
      const usuario = this.userService.buscarPorId(this.funcionarioEditandoId);
      if (!usuario) {
        return;
      }

      usuario.nome = this.nome.trim();
      usuario.email = this.email.trim();
      usuario.dataNascimento = this.dataNascimento;
      if (this.senha.trim()) {
        usuario.senha = this.senha;
      }

      this.userService.atualizar(usuario);
    } else {
      const usuario = new User(
        Date.now(),
        this.nome.trim(),
        this.email.trim(),
        this.dataNascimento,
        this.senha
      );
      this.userService.inserir(usuario);
    }

    this.funcionarios = this.userService.listarTodos();
    this.limparFormulario();
  }

  editarFuncionario(funcionario: User): void {
    this.funcionarioEditandoId = funcionario.id;
    this.nome = funcionario.nome;
    this.email = funcionario.email;
    this.dataNascimento = funcionario.dataNascimento;
    this.senha = funcionario.senha;
    this.confirmarSenha = funcionario.senha;
  }

  excluirFuncionario(id: number): void {
    const alvo = this.funcionarios.find((funcionario) => funcionario.id === id);
    if (!alvo) {
      return;
    }

    if (!window.confirm(`Deseja realmente remover ${alvo.nome} do cadastro?`)) {
      return;
    }

    this.userService.remover(id);
    this.funcionarios = this.userService.listarTodos();

    if (this.funcionarioEditandoId === id) {
      this.limparFormulario();
    }
  }

  limparFormulario(): void {
    this.funcionarioEditandoId = null;
    this.nome = '';
    this.email = '';
    this.dataNascimento = '';
    this.senha = '';
    this.confirmarSenha = '';
  }
}
