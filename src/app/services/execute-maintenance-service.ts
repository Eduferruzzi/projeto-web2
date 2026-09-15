import { Injectable } from '@angular/core';
// inutil por enquanto
@Injectable({
  providedIn: 'root'
})

export class ExecuteMaintenanceService {
    salvarConclusao(descricao: string, orientacoes: string): string {
        return orientacoes;
    }

    redirecionar(funcionarioId: string): string {
        return funcionarioId;
    }
}

