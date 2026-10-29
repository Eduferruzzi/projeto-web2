import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatEquip } from '../models/cat-equip'

const LS_CHAVE = 'catequips'

@Injectable({ providedIn: 'root' })
export class CatEquipService {
    private http = inject(HttpClient);

    listarNoBanco(): Observable<CatEquip[]> {
        return this.http.get<CatEquip[]>('http://localhost:8081/api/categorias');
    }

    listar(): CatEquip[]{
        const catEquips = localStorage[LS_CHAVE]

        return catEquips ? JSON.parse(catEquips) : []
    }

    inserir(catEquip:CatEquip) : void{
        const catEquips = this.listar()

        catEquip.id = new Date().getTime()

        catEquips.push(catEquip)

        localStorage[LS_CHAVE] = JSON.stringify(catEquips)
    }

    buscarPorId(id:number):CatEquip | undefined{
        const catEquips = this.listar()
        return catEquips.find(catEquip => catEquip.id === id)
    }

    remover(id:number):void {
        let catEquips = this.listar()

        catEquips = catEquips.filter(catEquip => catEquip.id !== id)

        localStorage[LS_CHAVE] = JSON.stringify(catEquips)
    }

    atualizar(catEquip:CatEquip):void{
        this.remover(catEquip.id)
        this.inserir(catEquip)
    }
}
