import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExecuteMaintenanceService } from '../../services/execute-maintenance-service';

@Component({
  selector: 'app-execute-maintenance',
  imports: [CommonModule],
  templateUrl: './execute-maintenance.html',
  styleUrl: './execute-maintenance.css'
})
export class ExecuteMaintenance {
  private maintenanceService = inject(ExecuteMaintenanceService);
  private router = inject(Router);

  exibirRedirecionamento: boolean = false;
  exibirFormConclusao: boolean = true;

  concluirManutencao(descricao: string, orientacoes: string): void {
    if (!descricao || !orientacoes) {
      alert('Por favor, preencha todos os campos da manutenção.');
      return;
    }

    // alerta de confirmação
    const confirmou = confirm('Deseja concluir esta manutenção?');

    if (confirmou) {
      this.maintenanceService.salvarConclusao(descricao, orientacoes);
      this.router.navigate(['/employee-home']);
    }
  }

  redirecionarManutencao(funcionarioId: string): void {
    if (!funcionarioId) {
      alert('Selecione um funcionário para o redirecionamento.');
      return;
    }

    // alerta de confirmação
    const confirmou = confirm('Deseja redirecionar esta manutenção para outro funcionário?');

    if (confirmou) {
      this.maintenanceService.redirecionar(funcionarioId);
      this.router.navigate(['/employee-home']);
    }
  }

  alternarRedirecionamento(mostrar: boolean): void {
    this.exibirRedirecionamento = mostrar;
    this.exibirFormConclusao = !mostrar;
  }

  cancelar(): void {
    this.router.navigate(['/employee-home']);
  }
}