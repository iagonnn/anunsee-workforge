# WorkForge v0.6

Frontend do sistema operacional da ANUNSEE, construído em React, TypeScript e Vite. Esta versão reorganiza o produto ao redor de dois ambientes diferentes:

- **Painel da agência:** projetos, tarefas, clientes, aprovações, CRM e operação interna.
- **Portal do cliente:** progresso, entregas, aprovações, arquivos e mensagens limitados ao próprio projeto.

## O que mudou na v0.6

- central operacional própria, sem repetir o dashboard genérico anterior;
- portfólio de projetos organizado por etapas e próxima entrega;
- cockpit de projeto com visão geral, tarefas, aprovações, arquivos e histórico;
- central de aprovações em formato de fila e área de revisão;
- visão mestre-detalhe para contas de clientes;
- portal externo com identidade visual e navegação próprias;
- visualização demonstrativa para alternar entre agência e cliente;
- layout responsivo do portal;
- configuração de SPA pronta para Vercel;
- 34 testes automatizados cobrindo rotas e interações essenciais.

## Executar localmente

Requisitos: Node.js 20 ou superior.

```powershell
corepack pnpm@11.13.0 install --force
corepack pnpm@11.13.0 run dev
```

Abra `http://127.0.0.1:4173/login`.

No primeiro acesso, conclua o onboarding ou escolha **Usar sistema básico**. No painel da agência, o botão **Ver portal do cliente** abre a experiência externa de demonstração.

## Comandos de validação

```powershell
corepack pnpm@11.13.0 run typecheck
corepack pnpm@11.13.0 run test
corepack pnpm@11.13.0 run build
```

## Publicar na Vercel

O repositório já contém `vercel.json` com o rewrite necessário para as rotas do React Router.

Ao importar o projeto na Vercel, use:

```text
Framework: Vite
Build command: pnpm run build
Output directory: dist
Install command: pnpm install
```

Nenhuma variável de ambiente é exigida para a demonstração atual.

## Limite importante da versão

A v0.6 é um frontend funcional para validar produto e experiência. Os dados permanecem no `localStorage` de cada navegador. Portanto, uma alteração feita no painel da agência ainda não aparece no navegador de um cliente real.

Antes de liberar uso operacional para clientes, a próxima etapa deve implementar:

1. autenticação real;
2. banco de dados central;
3. papéis `owner`, `team` e `client`;
4. isolamento por cliente e projeto;
5. regras de acesso no servidor;
6. armazenamento de arquivos;
7. histórico de atividades e aprovações;
8. notificações e recuperação de conta.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Lucide Icons
- Vitest e Testing Library

Nenhuma senha, token ou chave de API é armazenada no código ou no navegador.
