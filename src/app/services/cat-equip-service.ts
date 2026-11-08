import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatEquip } from '../models/cat-equip'

const API_URL = 'http://localhost:8080/api/categorias';

@Injectable({ providedIn: 'root' })
export class CatEquipService {
    private http = inject(HttpClient);

    listarNoBanco(): Observable<CatEquip[]> {
        return this.http.get<CatEquip[]>(API_URL);
    }

    buscarPorId(id: number): Observable<CatEquip> {
        return this.http.get<CatEquip>(`${API_URL}/${id}`);
    }

    inserir(catEquip: CatEquip): Observable<CatEquip> {
        return this.http.post<CatEquip>(API_URL, { nome: catEquip.nome });
    }

    atualizar(catEquip: CatEquip): Observable<CatEquip> {
        return this.http.put<CatEquip>(`${API_URL}/${catEquip.id}`, { nome: catEquip.nome });
    }

    remover(id: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/${id}`);
    }
}
