import { inject, Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CEP } from '../../models/CEP';

@Injectable({
    providedIn: 'root'
})

export class CepService {
    private http = inject(HttpClient); //injetando o http;

    buscarCep(cep : string) {
        return this.http.get<CEP>(
            `https://viacep.com.br/ws/${cep}/json/`
        );
    }
}
