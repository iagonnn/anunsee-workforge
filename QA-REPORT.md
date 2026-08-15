# QA Report — WorkForge Frontend v0.6

## Ambiente

- Node.js 24 no ambiente de validação;
- React 19;
- TypeScript 5.7;
- Vite 6;
- Vitest 4.

## Validações executadas

### TypeScript

```text
npm run typecheck
```

Resultado: aprovado, sem erros.

### Testes automatizados

```text
npm run test
```

Resultado:

- arquivos de teste: 1 aprovado;
- testes: 34 aprovados de 34;
- falhas: 0.

A suíte cobre autenticação simulada, onboarding, rotas internas, novas rotas do portal, criação de contatos, mensagens, tarefas, preferências e ativação de módulos.

### Build de produção

```text
npm run build
```

Resultado: aprovado.

- 1.615 módulos transformados;
- CSS final: aproximadamente 194 kB, 33 kB comprimidos;
- JavaScript final: aproximadamente 532 kB, 143 kB comprimidos.

O Vite emitiu apenas um aviso de oportunidade de code splitting. Não houve erro de compilação.

## Inspeção visual

A renderização automatizada por navegador não pôde ser concluída no ambiente de QA porque o executável Chromium não estava disponível. A estrutura responsiva foi verificada no código e as rotas foram renderizadas pelo ambiente de testes DOM. A inspeção final em navegador deve ser feita no checkpoint publicado da Vercel.

## Limites conhecidos

- autenticação ainda é simulada;
- persistência restrita ao navegador;
- nenhuma sincronização existe entre agência e cliente;
- uploads e downloads são visuais;
- notificações externas não foram conectadas;
- o modo agência visível no portal existe somente para facilitar a demonstração.
