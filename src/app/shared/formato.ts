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

// Produz "dd/mm/aaaa hh:mm", o mesmo formato usado na massa de dados.
// O toLocaleString padrao traria virgula e segundos, o que deixaria o
// historico com duas aparencias diferentes na mesma tabela.
export function formatarDataHoraBr(data : Date) : string {
    const dia = data.toLocaleDateString(LOCALE_BR);
    const hora = data.toLocaleTimeString(LOCALE_BR, {
        hour: '2-digit',
        minute: '2-digit',
    });
    return `${dia} ${hora}`;
}

export function dataHoraAtual() : string {
    return formatarDataHoraBr(new Date());
}
