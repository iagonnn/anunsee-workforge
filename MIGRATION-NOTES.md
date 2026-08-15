# Migration Notes — v0.5 para v0.6

## Mudança de produto

O WorkForge deixou de se apresentar como uma coleção ampla de módulos genéricos. A experiência principal agora parte do trabalho real da agência:

```text
Cliente → Projeto → Etapa → Tarefa/Entrega → Aprovação → Atualização
```

## Navegação interna

A sidebar foi reduzida e reorganizada em:

- Central;
- Operação;
- Clientes;
- Comercial;
- Sistema.

As telas antigas continuam disponíveis por rota para não remover trabalho anterior, mas deixaram de competir com o núcleo principal.

## Novas experiências

- `/dashboard`: central operacional da agência;
- `/execution/projects`: portfólio por jornada e próxima entrega;
- `/execution/projects/:projectId`: cockpit completo do projeto;
- `/automation/approvals`: central de decisões;
- `/relationships/clients-legacy`: contas e projetos em visão mestre-detalhe;
- `/portal/:clientId`: início do portal do cliente;
- `/portal/:clientId/project/:projectId`: projeto visto pelo cliente;
- `/portal/:clientId/approvals`: decisões externas;
- `/portal/:clientId/files`: biblioteca compartilhada;
- `/portal/:clientId/messages`: conversa do projeto.

## Persistência

As chaves existentes do `localStorage` foram preservadas. A v0.6 ainda não introduz banco de dados, autenticação real ou isolamento no servidor. O portal é uma demonstração de experiência e não deve receber dados sensíveis ou clientes reais antes da implementação do backend.

## Vercel

Foi adicionado `vercel.json` para encaminhar todas as rotas da SPA ao `index.html`.
