export type ModuleDefinition = {
  title: string
  eyebrow?: string
  description: string
  primaryAction: string
  stats: { label: string; value: string; hint: string }[]
  rows: { title: string; meta: string; status: string; tone?: 'green' | 'orange' | 'purple' | 'blue' }[]
}

export const moduleDefinitions: Record<string, ModuleDefinition> = {
  pipeline: {
    title: 'Pipeline', description: 'Leads, oportunidades e próximos passos em um fluxo comercial conectado.', primaryAction: 'Novo lead',
    stats: [
      { label: 'Pipeline aberto', value: 'US$ 84k', hint: '18 oportunidades' },
      { label: 'Conversão', value: '31%', hint: '+6% no trimestre' },
      { label: 'Próximas ações', value: '9', hint: '3 para hoje' },
    ],
    rows: [
      { title: 'Acme Flooring LLC', meta: 'Qualificado · próxima ação hoje', status: 'US$ 12.400', tone: 'green' },
      { title: 'Stoneworks Miami', meta: 'Proposta enviada · aguardando retorno', status: 'US$ 8.900', tone: 'purple' },
      { title: 'ClearView Cleaning', meta: 'Novo lead · pesquisa automática concluída', status: 'Score 86', tone: 'orange' },
    ],
  },
  proposals: {
    title: 'Propostas', description: 'Crie, acompanhe, aprove e transforme propostas em projetos.', primaryAction: 'Nova proposta',
    stats: [
      { label: 'Em negociação', value: '8', hint: 'US$ 48k' },
      { label: 'Aprovadas', value: '12', hint: 'Últimos 90 dias' },
      { label: 'Tempo médio', value: '4,2 dias', hint: 'Até a resposta' },
    ],
    rows: [
      { title: 'Portal do cliente — Northstar', meta: 'US$ 8.500 · enviada ontem', status: 'Visualizada', tone: 'purple' },
      { title: 'Website — Clínica Aurora', meta: 'US$ 5.200 · vence amanhã', status: 'Aguardando', tone: 'orange' },
      { title: 'Automação comercial — Atlas', meta: 'US$ 11.900 · aprovada', status: 'Aprovada', tone: 'green' },
    ],
  },
  meetings: {
    title: 'Reuniões', description: 'Agenda, pauta, decisões e próximos passos conectados ao trabalho.', primaryAction: 'Agendar reunião',
    stats: [
      { label: 'Hoje', value: '3', hint: '1 com cliente' },
      { label: 'Próximos passos', value: '8', hint: '3 ainda abertos' },
      { label: 'Tempo em reuniões', value: '4h 10m', hint: 'Esta semana' },
    ],
    rows: [
      { title: 'Kickoff Northstar', meta: 'Hoje, 14:30 · 4 participantes', status: 'Cliente', tone: 'purple' },
      { title: 'Daily da operação', meta: 'Hoje, 10:00 · recorrente', status: 'Interna', tone: 'blue' },
      { title: 'Revisão de automações', meta: 'Hoje, 17:00 · IA & Operação', status: 'Preparada', tone: 'green' },
    ],
  },
  ideas: {
    title: 'Ideias', description: 'Capture, avalie e transforme ideias em iniciativas, projetos ou tarefas.', primaryAction: 'Nova ideia',
    stats: [
      { label: 'Na caixa de entrada', value: '18', hint: '5 novas' },
      { label: 'Em avaliação', value: '7', hint: '2 de alto impacto' },
      { label: 'Implementadas', value: '24', hint: 'Neste ano' },
    ],
    rows: [
      { title: 'Agente de prospecção para flooring', meta: 'Alto impacto · médio esforço', status: 'Em avaliação', tone: 'purple' },
      { title: 'Portal de aprovação de conteúdo', meta: 'Médio impacto · baixo esforço', status: 'Planejada', tone: 'green' },
      { title: 'Resumo automático de reuniões', meta: 'Alto impacto · baixo esforço', status: 'Prioridade', tone: 'orange' },
    ],
  },
  processes: {
    title: 'Processos & Wiki', description: 'Documente procedimentos, responsáveis, versões e checklists reutilizáveis.', primaryAction: 'Novo processo',
    stats: [
      { label: 'Publicados', value: '36', hint: '8 departamentos' },
      { label: 'Para revisar', value: '5', hint: '2 vencidos' },
      { label: 'Execuções', value: '128', hint: 'Este mês' },
    ],
    rows: [
      { title: 'Onboarding de novo cliente', meta: 'Operations · 12 etapas', status: 'Publicado', tone: 'green' },
      { title: 'Qualificação de leads', meta: 'Comercial · 8 etapas', status: 'Em revisão', tone: 'purple' },
      { title: 'Publicação de conteúdo', meta: 'Marketing · 14 etapas', status: 'Atualizar', tone: 'orange' },
    ],
  },
  content: {
    title: 'Conteúdo', description: 'Planejamento editorial, produção, aprovações e histórico de publicações.', primaryAction: 'Novo conteúdo',
    stats: [
      { label: 'Planejados', value: '28', hint: 'Próximos 30 dias' },
      { label: 'Em aprovação', value: '6', hint: '2 vencem hoje' },
      { label: 'Publicados', value: '42', hint: 'Este mês' },
    ],
    rows: [
      { title: 'Blog — Refinish or replace?', meta: 'Northstar · 18 jul', status: 'Em revisão', tone: 'purple' },
      { title: 'Reels — Before & after', meta: 'Clínica Aurora · 19 jul', status: 'Aprovado', tone: 'green' },
      { title: 'Carrossel — Processo de instalação', meta: 'Instagram · 21 jul', status: 'Planejado', tone: 'blue' },
    ],
  },
  finance: {
    title: 'Finanças', description: 'Receitas, despesas, faturas e margem por cliente e projeto.', primaryAction: 'Novo lançamento',
    stats: [
      { label: 'Receita do mês', value: 'R$ 48,2k', hint: '+14% no mês' },
      { label: 'A receber', value: 'R$ 16,8k', hint: '3 faturas' },
      { label: 'Margem média', value: '38%', hint: '+4 pontos' },
    ],
    rows: [
      { title: 'Fatura Northstar — julho', meta: 'US$ 4.250 · vence em 3 dias', status: 'Aberta', tone: 'orange' },
      { title: 'Clínica Aurora — manutenção', meta: 'US$ 1.800 · recebida', status: 'Paga', tone: 'green' },
      { title: 'Ferramentas e serviços', meta: 'R$ 2.840 · julho', status: 'Despesa', tone: 'purple' },
    ],
  },
  approvals: {
    title: 'Aprovações', description: 'Revise ações preparadas por pessoas e agentes antes da execução.', primaryAction: 'Configurar política',
    stats: [
      { label: 'Pendentes', value: '3', hint: '1 vence hoje' },
      { label: 'Aprovadas hoje', value: '12', hint: 'Por 4 pessoas' },
      { label: 'Tempo médio', value: '18 min', hint: 'Até a decisão' },
    ],
    rows: [
      { title: 'Email para Acme Flooring', meta: 'Automação de qualificação de leads', status: 'Revisar', tone: 'orange' },
      { title: 'Criar projeto Northstar', meta: '18 tarefas e 4 responsáveis', status: 'Revisar', tone: 'purple' },
      { title: 'Publicar relatório semanal', meta: '4 portais de clientes', status: 'Pronto', tone: 'green' },
    ],
  },
  'automation-runs': {
    title: 'Execuções', description: 'Logs, resultados, custos e falhas de todos os workflows do workspace.', primaryAction: 'Exportar logs',
    stats: [
      { label: 'Execuções hoje', value: '63', hint: '96,4% sucesso' },
      { label: 'Em andamento', value: '2', hint: 'Sem bloqueios' },
      { label: 'Falhas', value: '1', hint: 'Requer revisão' },
    ],
    rows: [
      { title: 'Qualificar novo lead', meta: 'Acme Flooring · 38s', status: 'Concluída', tone: 'green' },
      { title: 'Resumo semanal de projetos', meta: 'Workspace principal · 1m 12s', status: 'Aguardando', tone: 'orange' },
      { title: 'Onboarding de cliente', meta: 'Clínica Aurora · 54s', status: 'Concluída', tone: 'green' },
    ],
  },
  clients: {
    title: 'Clientes', description: 'Organize empresas, portais e pontos de contato em um só lugar.', primaryAction: 'Novo cliente',
    stats: [
      { label: 'Clientes ativos', value: '24', hint: '+3 neste mês' },
      { label: 'Portais publicados', value: '18', hint: '75% da base' },
      { label: 'NPS médio', value: '9,1', hint: '+0,4 no trimestre' },
    ],
    rows: [
      { title: 'Horizonte Arquitetura', meta: '3 projetos ativos · Camila Rocha', status: 'Saudável', tone: 'green' },
      { title: 'Clínica Aurora', meta: '2 projetos ativos · Bruno Tavares', status: 'Aguardando retorno', tone: 'orange' },
      { title: 'Lumen Studios', meta: '1 projeto ativo · Larissa Mendes', status: 'Portal publicado', tone: 'purple' },
      { title: 'Atlas Renovations', meta: '4 projetos ativos · Alex Johnson', status: 'Saudável', tone: 'green' },
    ],
  },
  insights: {
    title: 'Insights de IA', description: 'Sinais importantes sobre riscos, oportunidades e padrões da operação.', primaryAction: 'Gerar análise',
    stats: [
      { label: 'Alertas ativos', value: '7', hint: '2 exigem atenção' },
      { label: 'Oportunidades', value: '12', hint: '+18% esta semana' },
      { label: 'Confiança média', value: '88%', hint: 'Fontes verificadas' },
    ],
    rows: [
      { title: 'Risco de atraso em Mobile App', meta: 'Dependência externa ainda não aprovada.', status: 'Alto', tone: 'orange' },
      { title: 'Capacidade disponível em Design', meta: '16 horas livres na próxima semana.', status: 'Oportunidade', tone: 'green' },
      { title: 'Aumento de retrabalho em QA', meta: 'Incidência cresceu 23% no último sprint.', status: 'Médio', tone: 'purple' },
    ],
  },
  team: {
    title: 'Visão da equipe', description: 'Acompanhe capacidade, disponibilidade e distribuição do trabalho.', primaryAction: 'Rebalancear com IA',
    stats: [
      { label: 'Utilização', value: '78%', hint: 'Meta: 75%' },
      { label: 'Pessoas ausentes', value: '3', hint: 'Próximos 7 dias' },
      { label: 'Capacidade livre', value: '46h', hint: 'Em 5 pessoas' },
    ],
    rows: [
      { title: 'Camila Rocha', meta: 'Design · 32h de 40h', status: '80%', tone: 'green' },
      { title: 'Bruno Tavares', meta: 'Engineering · 41h de 40h', status: '103%', tone: 'orange' },
      { title: 'Larissa Mendes', meta: 'Operations · 27h de 40h', status: '68%', tone: 'blue' },
    ],
  },
  goals: {
    title: 'Goals & OKRs', description: 'Conecte resultados do workspace, equipes e pessoas.', primaryAction: 'Novo objetivo',
    stats: [
      { label: 'Objetivos ativos', value: '11', hint: '4 da empresa' },
      { label: 'Progresso médio', value: '71%', hint: '+9% no mês' },
      { label: 'Em risco', value: '2', hint: 'Precisam revisão' },
    ],
    rows: [
      { title: 'Aumentar retenção de clientes', meta: 'Company · 3 resultados-chave', status: '82%', tone: 'green' },
      { title: 'Reduzir tempo de entrega', meta: 'Operations · 4 resultados-chave', status: '64%', tone: 'orange' },
      { title: 'Lançar novo portal do cliente', meta: 'Product · 3 resultados-chave', status: '76%', tone: 'purple' },
    ],
  },
  'my-work': {
    title: 'Meu trabalho', description: 'Tarefas, solicitações e menções que precisam da sua atenção.', primaryAction: 'Nova tarefa',
    stats: [
      { label: 'Para hoje', value: '8', hint: '2 atrasadas' },
      { label: 'Solicitações', value: '4', hint: '1 urgente' },
      { label: 'Menções', value: '12', hint: '5 não lidas' },
    ],
    rows: [
      { title: 'Revisar proposta da Northstar', meta: 'Project Alpha · vence hoje', status: 'Alta', tone: 'orange' },
      { title: 'Aprovar novo hero do portal', meta: 'Solicitação de Larissa Mendes', status: 'Revisão', tone: 'purple' },
      { title: 'Responder comentário em escopo', meta: 'Você foi mencionado por Mike', status: 'Menção', tone: 'blue' },
    ],
  },
  time: {
    title: 'Tempo & estimativas', description: 'Registre sessões, acompanhe precisão e consolide timesheets.', primaryAction: 'Iniciar cronômetro',
    stats: [
      { label: 'Registrado hoje', value: '5h 42m', hint: 'Meta: 7h 30m' },
      { label: 'Esta semana', value: '31h', hint: '82% da meta' },
      { label: 'Precisão', value: '91%', hint: '+4% no mês' },
    ],
    rows: [
      { title: 'Portal do cliente — UX review', meta: '1h 48m · hoje', status: 'Finalizada', tone: 'green' },
      { title: 'Dashboard — refinamento visual', meta: '2h 10m · hoje', status: 'Finalizada', tone: 'green' },
      { title: 'Planejamento do sprint', meta: '1h 44m · hoje', status: 'Em andamento', tone: 'purple' },
    ],
  },
  files: {
    title: 'Arquivos', description: 'Documentos, versões e permissões ligados aos projetos.', primaryAction: 'Enviar arquivo',
    stats: [
      { label: 'Armazenamento', value: '18,4 GB', hint: 'de 100 GB' },
      { label: 'Arquivos', value: '1.284', hint: '+42 esta semana' },
      { label: 'Compartilhados', value: '386', hint: '30% do total' },
    ],
    rows: [
      { title: 'Proposal-v4.pdf', meta: 'Horizonte Arquitetura · 3,8 MB', status: 'Atualizado agora', tone: 'green' },
      { title: 'Brand-assets.zip', meta: 'Marketing Website · 48 MB', status: '2 versões', tone: 'blue' },
      { title: 'Wireframes-final.fig', meta: 'Client Portal · 12 MB', status: 'Compartilhado', tone: 'purple' },
    ],
  },
  templates: {
    title: 'Templates', description: 'Padronize projetos, tarefas, reuniões e relatórios.', primaryAction: 'Novo template',
    stats: [
      { label: 'Templates', value: '28', hint: '6 criados por você' },
      { label: 'Usos este mês', value: '143', hint: '+21%' },
      { label: 'Tempo economizado', value: '38h', hint: 'Estimativa' },
    ],
    rows: [
      { title: 'Project Kickoff', meta: 'Projetos · 18 etapas', status: 'Mais usado', tone: 'green' },
      { title: 'Weekly Client Report', meta: 'Relatórios · 8 blocos', status: 'Publicado', tone: 'purple' },
      { title: 'Site Inspection', meta: 'Operações · 24 itens', status: 'Rascunho', tone: 'blue' },
    ],
  },
  reports: {
    title: 'Relatórios', description: 'Transforme atividade operacional em informação executiva.', primaryAction: 'Criar relatório',
    stats: [
      { label: 'Relatórios ativos', value: '16', hint: '5 agendados' },
      { label: 'Visualizações', value: '1.847', hint: '+12% no mês' },
      { label: 'Compartilhados', value: '9', hint: 'Com clientes' },
    ],
    rows: [
      { title: 'Resumo executivo — junho', meta: 'Todos os projetos · atualizado hoje', status: 'Pronto', tone: 'green' },
      { title: 'Capacidade da equipe', meta: 'Operations · atualizado ontem', status: 'Agendado', tone: 'purple' },
      { title: 'Saúde de clientes', meta: 'Customer Success · 2 dias atrás', status: 'Rascunho', tone: 'blue' },
    ],
  },
  members: {
    title: 'Membros', description: 'Convites, funções, departamentos e acesso ao workspace.', primaryAction: 'Convidar membro',
    stats: [
      { label: 'Membros ativos', value: '32', hint: '4 administradores' },
      { label: 'Convites pendentes', value: '3', hint: 'Expiram em 5 dias' },
      { label: 'Equipes', value: '6', hint: '3 departamentos' },
    ],
    rows: [
      { title: 'Camila Rocha', meta: 'Owner · Operations', status: 'Ativa', tone: 'green' },
      { title: 'Bruno Tavares', meta: 'Manager · Engineering', status: 'Ativo', tone: 'green' },
      { title: 'Larissa Mendes', meta: 'Member · Design', status: 'Convite pendente', tone: 'orange' },
    ],
  },
  security: {
    title: 'Segurança', description: 'Políticas, autenticação e sessões do workspace.', primaryAction: 'Revisar segurança',
    stats: [
      { label: 'Usuários com 2FA', value: '91%', hint: '29 de 32' },
      { label: 'Sessões ativas', value: '47', hint: '6 dispositivos novos' },
      { label: 'Risco', value: 'Baixo', hint: 'Nenhum incidente' },
    ],
    rows: [
      { title: 'Autenticação em duas etapas', meta: 'Obrigatória para administradores', status: 'Ativa', tone: 'green' },
      { title: 'Política de senha', meta: 'Mínimo de 12 caracteres', status: 'Conforme', tone: 'green' },
      { title: 'Whitelist de IP', meta: 'Não configurada', status: 'Opcional', tone: 'blue' },
    ],
  },
  workspace: {
    title: 'Workspace', description: 'Identidade, multiempresa e configurações gerais.', primaryAction: 'Salvar alterações',
    stats: [
      { label: 'Workspaces', value: '4', hint: '2 de clientes' },
      { label: 'Clientes gerenciados', value: '18', hint: 'Agency mode' },
      { label: 'Região principal', value: 'Brasil', hint: 'America/Sao_Paulo' },
    ],
    rows: [
      { title: 'WorkForge Demo', meta: 'Workspace principal · BRL', status: 'Atual', tone: 'green' },
      { title: 'Flooring USA', meta: 'Cliente · USD', status: 'Ativo', tone: 'purple' },
      { title: 'Cleaning Portugal', meta: 'Cliente · EUR', status: 'Ativo', tone: 'blue' },
    ],
  },
  billing: {
    title: 'Plano e cobrança', description: 'Visão simulada de assinatura, uso e faturamento.', primaryAction: 'Gerenciar plano',
    stats: [
      { label: 'Plano', value: 'Scale', hint: 'Renova em 18 jul' },
      { label: 'Assentos usados', value: '32 / 40', hint: '8 disponíveis' },
      { label: 'Uso de IA', value: '64%', hint: '128k de 200k créditos' },
    ],
    rows: [
      { title: 'Assinatura WorkForge Scale', meta: 'Cobrança mensal · cartão final 4242', status: 'Ativa', tone: 'green' },
      { title: 'Fatura de junho', meta: 'R$ 1.980,00 · paga em 18 jun', status: 'Paga', tone: 'green' },
      { title: 'Limite de armazenamento', meta: '18,4 GB de 100 GB', status: 'Normal', tone: 'blue' },
    ],
  },
  preferences: {
    title: 'Preferências', description: 'Idioma, datas, notificações, atalhos e aparência.', primaryAction: 'Salvar preferências',
    stats: [
      { label: 'Idioma', value: 'PT-BR', hint: 'Por usuário' },
      { label: 'Fuso horário', value: 'GMT-3', hint: 'São Paulo' },
      { label: 'Resumo', value: 'Diário', hint: '08:00' },
    ],
    rows: [
      { title: 'Aparência', meta: 'Tema escuro · densidade confortável', status: 'Personalizado', tone: 'purple' },
      { title: 'Notificações', meta: 'Email, push e in-app', status: 'Ativas', tone: 'green' },
      { title: 'Atalhos', meta: 'Ctrl/Cmd + K para busca', status: 'Padrão', tone: 'blue' },
    ],
  },

  'client-portal': {
    title: 'Portal do cliente', description: 'Uma área simples e segura para progresso, arquivos, aprovações e comunicação.', primaryAction: 'Visualizar como cliente',
    stats: [
      { label: 'Projetos visíveis', value: '3', hint: '2 em andamento' },
      { label: 'Aprovações', value: '2', hint: '1 vence hoje' },
      { label: 'Arquivos recentes', value: '14', hint: 'Últimos 30 dias' },
    ],
    rows: [
      { title: 'Progresso do projeto', meta: 'Visão resumida sem ferramentas internas.', status: '82%', tone: 'green' },
      { title: 'Aprovação do novo layout', meta: 'Solicitada por Larissa Mendes.', status: 'Pendente', tone: 'orange' },
      { title: 'Relatório semanal', meta: 'Publicado hoje às 08:00.', status: 'Novo', tone: 'purple' },
    ],
  },
  help: {
    title: 'Ajuda', description: 'Artigos, vídeos e suporte para sua equipe.', primaryAction: 'Falar com suporte',
    stats: [
      { label: 'Artigos', value: '184', hint: '12 atualizados' },
      { label: 'Vídeos', value: '38', hint: '4 novos' },
      { label: 'Tempo médio', value: '3 min', hint: 'Para encontrar resposta' },
    ],
    rows: [
      { title: 'Começando no WorkForge', meta: 'Primeiros passos · 6 min', status: 'Popular', tone: 'green' },
      { title: 'Como organizar workspaces', meta: 'Administração · 4 min', status: 'Atualizado', tone: 'purple' },
      { title: 'Permissões e portal do cliente', meta: 'Segurança · 8 min', status: 'Guia', tone: 'blue' },
    ],
  },
}

const aiBase: ModuleDefinition = {
  title: 'Ferramenta de IA', description: 'Experiência simulada pronta para conexão futura com uma API.', primaryAction: 'Executar com IA',
  stats: [
    { label: 'Execuções hoje', value: '18', hint: 'Média: 24s' },
    { label: 'Itens gerados', value: '63', hint: '87% aprovados' },
    { label: 'Créditos', value: '64%', hint: 'Disponível no plano' },
  ],
  rows: [
    { title: 'Entrada pronta para análise', meta: 'Selecione projeto, período e escopo.', status: 'Pronto', tone: 'green' },
    { title: 'Fontes do workspace', meta: 'Tarefas, projetos, comentários e arquivos.', status: '8 fontes', tone: 'purple' },
    { title: 'Histórico recente', meta: 'Resultados permanecem disponíveis localmente.', status: 'Simulado', tone: 'blue' },
  ],
}

for (const [id, title, description, action] of [
  ['ai-generate', 'Gerar tarefas', 'Transforme uma descrição em tarefas sugeridas, responsáveis e prazos.', 'Gerar tarefas'],
  ['ai-summarize', 'Resumir', 'Converta discussões longas em decisões e próximos passos.', 'Gerar resumo'],
  ['ai-proposal', 'Criar proposta', 'Estruture escopo, cronograma e orçamento em uma proposta editável.', 'Gerar proposta'],
  ['ai-report', 'Criar relatório', 'Gere um relatório executivo a partir da atividade do workspace.', 'Gerar relatório'],
  ['ai-risks', 'Alertas de risco', 'Encontre bloqueios, atrasos e dependências antes que se tornem críticos.', 'Analisar riscos'],
  ['ai-activity', 'Activity insights', 'Identifique padrões positivos, problemas e evidências na atividade recente.', 'Analisar atividade'],
  ['ai-workspace', 'Pergunte ao workspace', 'Faça perguntas usando tarefas, reuniões, clientes, projetos e arquivos.', 'Fazer pergunta'],
] as const) {
  moduleDefinitions[id] = { ...aiBase, title, description, primaryAction: action }
}

for (const [id, title, description, action] of [
  ['integrations', 'Hub de integrações', 'Conecte as ferramentas usadas pela sua equipe e acompanhe sincronizações.', 'Explorar integrações'],
  ['import-trello', 'Importar do Trello', 'Mapeie quadros, listas, cartões, responsáveis e etiquetas.', 'Conectar Trello'],
  ['import-asana', 'Importar do Asana', 'Traga projetos, seções, tarefas, responsáveis e datas.', 'Conectar Asana'],
  ['import-csv', 'Importar CSV', 'Faça upload, mapeie colunas, valide erros e importe registros.', 'Selecionar arquivo'],
  ['export-data', 'Exportar dados', 'Exporte tarefas, projetos, clientes e arquivos em formatos comuns.', 'Nova exportação'],
] as const) {
  moduleDefinitions[id] = {
    title, description, primaryAction: action,
    stats: [
      { label: 'Última execução', value: 'Hoje', hint: '14:32' },
      { label: 'Registros', value: '1.284', hint: '32 atualizados' },
      { label: 'Erros', value: '0', hint: 'Tudo sincronizado' },
    ],
    rows: [
      { title: 'Configuração', meta: 'Permissões e escopo da integração.', status: 'Pronta', tone: 'green' },
      { title: 'Mapeamento', meta: 'Projetos, responsáveis, status e etiquetas.', status: 'Revisar', tone: 'purple' },
      { title: 'Histórico', meta: 'Resultados e logs das últimas execuções.', status: 'Disponível', tone: 'blue' },
    ],
  }
}
