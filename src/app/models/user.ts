export class User {
    constructor(
        public id: number,
        public nome: string,
        public email: string = '',
        public dataNascimento: string = '',
        public senha: string = ''
    ) {
    }
}
