# Notes App

Sistema fullstack de anotações com React, Vite, TypeScript, Node.js, Express, Prisma e PostgreSQL.

## Estrutura

```text
notes-app/
  backend/
    src/
      controllers/
      middlewares/
      prisma/
      routes/
      services/
      server.ts
    prisma/
      schema.prisma
    .env.example
    package.json
    tsconfig.json
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      styles/
      App.tsx
      main.tsx
    package.json
    tsconfig.json
    vite.config.ts
  README.md
```

## Requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL rodando localmente ou em um servidor acessível

## Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Configure a variável `DATABASE_URL` no `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=notes_app"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Com essa configuração, o app usa o banco `postgres` e mantém suas tabelas isoladas no schema `notes_app`.

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Rode a migration:

```bash
npm run prisma:migrate
```

Inicie o backend:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

Rotas principais:

- `GET /notes`
- `GET /notes?search=texto`
- `POST /notes`
- `PUT /notes/:id`
- `PATCH /notes/:id/favorite`
- `DELETE /notes/:id`

## Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o frontend:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Como usar

1. Inicie o PostgreSQL.
2. Configure o `backend/.env`.
3. Rode as migrations do Prisma no backend.
4. Inicie o backend em `http://localhost:3000`.
5. Inicie o frontend em `http://localhost:5173`.

## Organização do Código

O backend usa uma divisão simples em camadas:

- `routes`: define os endpoints REST.
- `controllers`: recebe a requisição e chama o serviço adequado.
- `services`: concentra as regras de negócio e acessa o Prisma.
- `middlewares`: tratamento global de erros e erros de aplicação.
- `prisma`: conexão com o Prisma Client.

O frontend mantém responsabilidades separadas:

- `components`: componentes visuais reutilizáveis.
- `hooks`: hooks próprios, como debounce da busca.
- `pages`: tela principal da aplicação.
- `services`: cliente Axios e funções de API.
- `styles`: CSS global organizado.

O projeto não usa autenticação, IA, backend fake ou `localStorage` como banco. Todas as notas são persistidas no PostgreSQL via Prisma.
