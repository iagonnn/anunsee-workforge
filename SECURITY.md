# Segurança — WorkForge Frontend v0.5

Esta entrega é exclusivamente frontend e demonstrativa.

## Garantias desta versão

- nenhuma chave de API;
- nenhum token real;
- nenhum segredo no bundle;
- nenhum `.env` real;
- nenhuma integração ativa;
- nenhum envio real de mensagem;
- nenhum scraping;
- nenhuma senha persistida pelo fluxo de login;
- dados demonstrativos fictícios;
- configuração empresarial armazenada apenas no navegador;
- tratamento defensivo de JSON inválido no localStorage.

## Limitações

- login não autentica usuários;
- permissões não são aplicadas por servidor;
- dados no localStorage podem ser alterados pelo usuário;
- 2FA é apenas uma interface futura;
- módulos de comunicação não enviam conteúdo para canais externos;
- LGPD, auditoria e retenção precisam ser implementadas no backend antes de uso com dados reais.

## Regras para próximas versões

- segredos somente no backend;
- API com autenticação e autorização por workspace;
- criptografia e políticas de retenção;
- registro de consentimento e origem de dados;
- trilha de auditoria para automações;
- aprovação humana para ações externas de risco.
