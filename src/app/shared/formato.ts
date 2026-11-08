// Funcoes de formatacao no padrao brasileiro, exigido nos requisitos
// nao-funcionais. Ficam aqui para nao serem reescritas em cada tela.

const LOCALE_BR = 'pt-BR';

export function formatarMoedaBr(valor : number | null) : string {
    if (valor === null) {
        return 'Não informado';
    }
    return valor.toLocaleString(LOCALE_BR, {
        style: 'currency',
        currency: 'BRL',
    });
}
