import { Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Solicitacao } from '../../models/Solicitacao';
import { SolicitacaoService } from '../../services';


@Component({
  selector: 'app-employee-home',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employee-home.html',
  styleUrl: './employee-home.css',
})
export class EmployeeHome {
  
  solicitacoes : Solicitacao[] = [];
  constructor (private solicitacaoService : SolicitacaoService){}
  
  ngOnInit() : void{
    this.solicitacoes = this.solicitacaoService.listarAbertas();
  }

  verif(text : string, limite : number = 30) : string {
    return text.length > limite ? text.substring(0, limite) + "..." : text;
  }

  
}
