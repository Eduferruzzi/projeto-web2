import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  private detector = inject(ChangeDetectorRef);
  private aoConfirmar?: () => void;
  @Input() aberto = true;
  @Input() informativo = false;

  abrir(mensagem: string, aoConfirmar?: () => void, informativo = false): void {
    this.mensagem = mensagem;
    this.aoConfirmar = aoConfirmar;
    this.informativo = informativo;
    this.aberto = true;
    this.detector.markForCheck();
  }

  confirmar(): void {
    const acao = this.aoConfirmar;
    this.aberto = false;
    this.aoConfirmar = undefined;
    this.confirmado.emit();
    acao?.();
  }

  cancelar(): void {
    if (this.informativo) {
      this.confirmar();
      return;
    }
    this.aberto = false;
    this.aoConfirmar = undefined;
    this.cancelado.emit();
  }

  @Input() titulo = '';
  @Input() acao = 'realizar esta ação';
  @Input() mensagem = '';
  @Input() textoConfirmacao = 'Confirmar';
  @Input() textoCancelamento = 'Cancelar';
  @Input() classeConfirmacao = 'btn-danger';
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
}
