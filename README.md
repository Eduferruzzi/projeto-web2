# Manutenção de Equipamentos

Trabalho da disciplina de Desenvolvimento Web II (TADS - UFPR). Sistema de controle de manutenção de equipamentos baseado em solicitações de serviço, com dois perfis: cliente e funcionário.

O cliente se cadastra, abre solicitações, aprova ou rejeita orçamentos e paga o serviço. O funcionário faz os orçamentos, executa ou redireciona a manutenção, finaliza as solicitações e cuida dos cadastros de categorias e funcionários, além dos relatórios de receita em PDF. Toda mudança de estado da solicitação fica salva no histórico.

## Tecnologias

- Front-end: Angular 22 (componentes standalone), Bootstrap 5, ngx-mask, jsPDF
- Back-end: Spring Boot 4 com Java 21
- Banco: MySQL
- Endereço preenchido pelo CEP com a API do ViaCEP
- Senhas salvas com hash SHA-256 + salt

## Estrutura

```
backend/            API REST em Spring Boot
database/
  script.sql        criação do banco e das tabelas
  inserts.sql       dados iniciais para teste
src/                front-end Angular
bruno-manutencao/   coleção do Bruno para testar a API
```

## Como rodar

Precisa ter instalado: Node.js, Java 21, MySQL e o VS Code com as extensões Extension Pack for Java e Spring Boot Extension Pack.

### 1. Banco de dados

Rodar os dois scripts `script.sql` e o `inserts.sql` nessa ordem, com o banco vazio:

O `script.sql` cria o banco `manutencao_db`. Se precisar rodar de novo, apague o banco antes, porque os inserts usam ids fixos.

### 2. Arquivo .env

Criar um arquivo `.env` na raiz do projeto (ele está no `.gitignore`, então cada um tem o seu):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha_do_mysql
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email_que_envia@gmail.com
MAIL_PASSWORD=senha_de_app_do_gmail
MAIL_FROM=no-reply@localhost
```

As variáveis de e-mail são usadas para mandar a senha gerada no autocadastro. No Gmail não dá para usar a senha normal da conta, tem que gerar uma senha de app (precisa ter a verificação em duas etapas ativada).

### 3. Back-end

Rodamos pelo VS Code. Abrindo a pasta do projeto, a extensão do Java reconhece o `backend/pom.xml` e baixa as dependências automaticamente.

Depois ir no Spring Boot Dashboard, na barra lateral, e dar play no `backend`. Também dá para abrir o `BackendApplication.java` e clicar em Run em cima do `main`.

Sobe em `http://localhost:8080`. O `.env` da raiz é lido automaticamente.

### 4. Front-end

Na raiz do projeto:

```
npm install
ng serve
```

Abre em `http://localhost:4200`.

## Usuários para teste

Já vêm cadastrados pelo `inserts.sql`:

| Perfil | E-mail | Senha |
|---|---|---|
| Funcionário | maria@gmail.com | 1234 |
| Funcionário | mario@gmail.com | 1234 |
| Funcionário | funcionario@gmail.com | 4321 |
| Cliente | joao@gmail.com | 1234 |
| Cliente | jose@gmail.com | 1234 |
| Cliente | joana@gmail.com | 1234 |
| Cliente | joaquina@gmail.com | 1234 |
| Cliente | cliente@gmail.com | 1234 |

Também tem 5 categorias (Notebook, Desktop, Impressora, Mouse e Teclado).


## Outros

- Remoções são feitas por desativação (campo `ativo`), nada é apagado do banco.
- Padrão de branches, commits e PRs está no [CONTRIBUTING.md](CONTRIBUTING.md).
