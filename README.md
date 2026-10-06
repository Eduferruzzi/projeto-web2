# ProjetoWeb2

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Backend Spring Boot e MySQL

O backend Java fica isolado em `backend/`, separado do frontend Angular. Ele usa Maven (to pesquisando pra ver se vamos usar isso mesmo, esperando opiniao de voces tmb) e Spring Boot 4.1.1 com os starters Web MVC, Spring Data JPA e testes, o driver MySQL e carregado em tempo de execucao.

### Requisitos

- Java 17 ou superior
- Maven 3.6.3 ou superior
- MySQL em execucao

### Banco de dados

Executar o script dos DDL`s antes de iniciar a API de fato.

### Iniciar o backend no PowerShell

Ainda testando, nunca fiz isso desse jeito, mas aqui funcionou normal, pelo menos pros testes

Na raiz do repositorio, configure as variaveis para a conexao local:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/manutencao_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "senha-de-vcs"
```

Depois inicie a aplicacao:

```powershell
cd backend
mvn spring-boot:run
```

A configuracao de conexao fica em `backend/src/main/resources/application.properties`. As credenciais sao fornecidas pelo ambiente e nao devem ser adicionadas ao Git. O backend estabelece a estrutura e as dependencias; controllers, entidades e endpoints de negocio ainda precisam ser implementados.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
