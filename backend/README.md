# PR to Agent

Projeto base com Express, TypeScript e Prisma.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Prisma** - ORM para banco de dados

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados.

3. Configure o Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em produção (após build)
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa as migrações do banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio para visualizar o banco

## 📁 Estrutura do Projeto

```
pr-to-agent/
├── src/
│   └── index.ts          # Arquivo principal da aplicação
├── prisma/
│   └── schema.prisma     # Schema do Prisma
├── dist/                 # Arquivos compilados (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuração do Banco de Dados

O projeto está configurado para usar PostgreSQL. Certifique-se de ter um banco de dados PostgreSQL rodando e configure a URL de conexão no arquivo `.env`.

Para usar outro banco de dados (MySQL, SQLite, etc.), altere o `provider` no arquivo `prisma/schema.prisma`.

