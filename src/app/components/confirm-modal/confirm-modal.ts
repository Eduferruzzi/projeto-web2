import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  @Input() titulo = 'Confirmar ação';
  @Input() mensagem = '';
  @Input() textoConfirmacao = 'Confirmar';
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
}
