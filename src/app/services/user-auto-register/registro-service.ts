import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RegistroCliente {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface RegistroClienteResponse {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/api/usuarios/registro';

  registrar(dados: RegistroCliente) {
    return this.http.post<RegistroClienteResponse>(this.url, dados);
  }
}
