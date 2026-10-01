import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services';
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
  // Lista exibida no template e identificador usado para distinguir edição de novo cadastro.
  funcionarios: User[] = [];
  funcionarioEditandoId: number | null = null;

  // Campos vinculados por [(ngModel)] ao formulário employee-crud.html.
  nome = '';
  email = '';
  dataNascimento = '';
  senha = '';
  confirmarSenha = '';

  // UserService é injetado pelo Angular e mantém os dados de usuários usados por esta tela.
  constructor(private userService: UserService) {}

  // Carrega a lista inicial quando o componente é iniciado.
  ngOnInit(): void {
    this.funcionarios = this.userService.listarTodos();
  }

  // Valida o formulário, insere um User novo ou atualiza o funcionário em edição.
  // NgForm é opcional para permitir chamadas sem referência ao formulário do template.
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

  // Copia os dados do funcionário selecionado para os campos ligados ao formulário.
  editarFuncionario(funcionario: User): void {
    this.funcionarioEditandoId = funcionario.id;
    this.nome = funcionario.nome;
    this.email = funcionario.email;
    this.dataNascimento = funcionario.dataNascimento;
    this.senha = funcionario.senha;
    this.confirmarSenha = funcionario.senha;
  }

  // Confirma a remoção no navegador e limpa a edição caso ela seja do mesmo funcionário.
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

  // Restaura os campos e o identificador para o estado de cadastro novo.
  limparFormulario(): void {
    this.funcionarioEditandoId = null;
    this.nome = '';
    this.email = '';
    this.dataNascimento = '';
    this.senha = '';
    this.confirmarSenha = '';
  }
}
