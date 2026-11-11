import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatEquip } from '../models/cat-equip'

const API_URL = 'http://localhost:8080/api/categorias';
const AUTH_OPTIONS = { withCredentials: true };

@Injectable({ providedIn: 'root' })
export class CatEquipService {
    private http = inject(HttpClient);

    listarNoBanco(): Observable<CatEquip[]> {
        return this.http.get<CatEquip[]>(API_URL, AUTH_OPTIONS);
    }

    buscarPorId(id: number): Observable<CatEquip> {
        return this.http.get<CatEquip>(`${API_URL}/${id}`, AUTH_OPTIONS);
    }

    inserir(catEquip: CatEquip): Observable<CatEquip> {
        return this.http.post<CatEquip>(API_URL, { nome: catEquip.nome }, AUTH_OPTIONS);
    }

    atualizar(catEquip: CatEquip): Observable<CatEquip> {
        return this.http.put<CatEquip>(`${API_URL}/${catEquip.id}`, { nome: catEquip.nome }, AUTH_OPTIONS);
    }

    remover(id: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/${id}`, AUTH_OPTIONS);
    }
}
