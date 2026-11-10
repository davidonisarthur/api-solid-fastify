# App

GymPass style app.

## Executar localmente

A API roda no Node.js e usa um servidor PostgreSQL local. Instale as dependências
com `npm install` e, se ainda não houver `.env`, copie `.env.example` para `.env`.
Os valores do exemplo são destinados ao desenvolvimento local.

```bash
npm run start:dev
```

Antes de iniciar a API, instale e inicie o PostgreSQL e crie o usuário e o banco.
Em uma instalação Linux com o usuário administrador `postgres`, se ainda não
existirem, execute:

```bash
sudo -u postgres createuser --pwprompt api_solid
sudo -u postgres createdb --owner=api_solid api_solid
```

Use no `.env` a mesma senha definida ao criar o usuário.

A API escuta na porta 3333 e conecta ao banco em `localhost:5432` por padrão.
As variáveis `POSTGRES_*` do `.env` configuram a conexão. Elas não criam o usuário
nem o banco e não alteram suas credenciais no PostgreSQL.

## TypeORM e migrations

A conexão fica em `src/database/data-source.ts`. `synchronize` está desativado:
as alterações de tabelas devem ser feitas por migrations.

Use `EntitySchema` para os mapeamentos em `src/database/entities`, compatível
com o fluxo atual de `tsx` e `tsup` sem depender de metadados de decorators.
Importe os schemas no DataSource e registre-os no array `entities`.

Depois de definir uma entidade, gere uma migration com o banco em execução:

```bash
npm run migration:generate -- src/database/migrations/CreateUsers
```

Importe a classe gerada no DataSource e adicione-a ao array `migrations`.
Esse registro explícito permite que o tsup inclua as migrations no build.

```bash
npm run migration:show
npm run migration:run
npm run migration:revert
```

A configuração inicial não cria tabelas, pois ainda não há entidades ou migrations.
Para executar o código compilado:

```bash
npm run build
node node_modules/typeorm/cli.js migration:run -d build/database/data-source.js
npm start
```

## Organização e SOLID

Mantenha os mapeamentos e o DataSource em `src/database`. Os casos de uso devem
depender de interfaces de repositórios, recebidas pelo construtor. As implementações
com TypeORM ficam em `src/repositories/typeorm` e são injetadas ao montar cada caso
de uso. Assim, a lógica de negócio pode ser testada com repositórios em memória.

## RFs (Requisitos Funcionais)

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [ ] Deve ser possível o usuário obter seu histórico de check-ins;
- [ ] Deve ser possível o usuário buscar academias próximas;
- [ ] Deve ser possível o usuário buscar academias pelo nome;
- [ ] Deve ser possível o usuário realizar check-in em uma academia;
- [ ] Deve ser possível validar o check-in de um usuário;
- [ ] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [ ] A senha do usuário precisa estar criptografa;
- [ ] Os dados da aplicacao precisam estar num DB PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 20 listas por página;
- [ ] O usuário deve ser identificado por um JWT (Jason Web Token);
