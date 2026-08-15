import { ArrowRight, Bot, Building2, CalendarClock, CheckCircle2, CircleAlert, Clock3, FileText, FolderKanban, GitBranch, Lightbulb, ShieldCheck, Sparkles, Target, UsersRound, Workflow, BookOpenText, Files, Settings2, CreditCard, PlugZap, History, ClipboardCheck, BarChart3, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, PageHeader } from '../components/ui'

type OverviewModule = { title: string; description: string; route: string; icon: LucideIcon; meta: string; tone: 'green' | 'orange' | 'purple' | 'blue' | 'neutral' }
type OverviewConfig = {
  eyebrow: string
  title: string
  description: string
  metrics: { label: string; value: string; hint: string }[]
  modules: OverviewModule[]
  activityTitle: string
  activities: { title: string; meta: string; status: string; tone: OverviewModule['tone']; route: string }[]
  focusTitle: string
  focusDescription: string
  focusRoute: string
}

const configs: Record<string, OverviewConfig> = {
  relationships: {
    eyebrow: 'Relacionamentos', title: 'Central comercial', description: 'Acompanhe a jornada completa, do primeiro contato ao cliente ativo.',
    metrics: [
      { label: 'Pipeline aberto', value: 'US$ 84k', hint: '18 oportunidades' },
      { label: 'Propostas pendentes', value: '8', hint: '3 com ação hoje' },
      { label: 'Clientes ativos', value: '24', hint: '4 em onboarding' },
      { label: 'Conversão', value: '31%', hint: '+6% no trimestre' },
    ],
    modules: [
      { title: 'Pipeline', description: 'Leads e oportunidades por etapa', route: '/relationships/pipeline', icon: GitBranch, meta: '18 oportunidades', tone: 'blue' },
      { title: 'Clientes', description: 'Contas, projetos e portais', route: '/relationships/clients', icon: Building2, meta: '24 ativos', tone: 'green' },
      { title: 'Propostas', description: 'Criação, envio e aprovação', route: '/relationships/proposals', icon: FileText, meta: '8 abertas', tone: 'orange' },
      { title: 'Portais', description: 'Experiência externa dos clientes', route: '/relationships/portals', icon: UsersRound, meta: '7 publicados', tone: 'purple' },
    ],
    activityTitle: 'Movimento comercial', activities: [
      { title: 'Northstar visualizou a proposta', meta: 'Há 2 horas · US$ 8.500', status: 'Visualizada', tone: 'purple', route: '/relationships/proposals/proposal-northstar' },
      { title: 'ClearView foi qualificado pela automação', meta: 'Score 86 · próxima ação hoje', status: 'Qualificado', tone: 'green', route: '/relationships/pipeline' },
      { title: 'Clínica Aurora precisa de follow-up', meta: 'Sem resposta há 4 dias', status: 'Atenção', tone: 'orange', route: '/relationships/clients/client-bright' },
    ],
    focusTitle: '3 negócios sem próxima ação', focusDescription: 'Organize o follow-up antes que as oportunidades esfriem.', focusRoute: '/relationships/pipeline',
  },
  execution: {
    eyebrow: 'Execução', title: 'Operação do trabalho', description: 'Projetos, tarefas, equipe e agenda em uma visão operacional única.',
    metrics: [
      { label: 'Projetos ativos', value: '12', hint: '2 em risco' },
      { label: 'Tarefas abertas', value: '46', hint: '6 vencem hoje' },
      { label: 'Capacidade da equipe', value: '78%', hint: 'Faixa saudável' },
      { label: 'Entregas da semana', value: '9', hint: '3 concluídas' },
    ],
    modules: [
      { title: 'Projetos', description: 'Portfólio, saúde e entregas', route: '/execution/projects', icon: FolderKanban, meta: '12 ativos', tone: 'blue' },
      { title: 'Tarefas', description: 'Lista, Kanban e prioridades', route: '/execution/tasks', icon: CheckCircle2, meta: '46 abertas', tone: 'green' },
      { title: 'Reuniões', description: 'Agenda, pautas e decisões', route: '/execution/meetings', icon: CalendarClock, meta: '3 hoje', tone: 'orange' },
      { title: 'Equipe', description: 'Capacidade e distribuição', route: '/execution/team', icon: UsersRound, meta: '78% utilizada', tone: 'purple' },
    ],
    activityTitle: 'Atenção da operação', activities: [
      { title: 'Portal Northstar entra em revisão hoje', meta: '82% concluído · 4 tarefas pendentes', status: 'No prazo', tone: 'green', route: '/execution/projects/project-northstar' },
      { title: 'Mobile App ultrapassou a capacidade', meta: 'Bruno Tavares está com 112% de utilização', status: 'Risco', tone: 'orange', route: '/execution/team' },
      { title: '6 tarefas sem responsável', meta: 'Distribuição necessária antes do planejamento', status: 'Pendente', tone: 'purple', route: '/execution/tasks' },
    ],
    focusTitle: 'Rebalancear a equipe', focusDescription: 'Há duas pessoas acima de 100% da capacidade planejada.', focusRoute: '/execution/team',
  },
  strategy: {
    eyebrow: 'Estratégia', title: 'Direção e aprendizado', description: 'Conecte objetivos, resultados, ideias e sinais da operação.',
    metrics: [
      { label: 'Objetivos ativos', value: '6', hint: '2 em risco' },
      { label: 'Progresso médio', value: '63%', hint: '+8% no mês' },
      { label: 'Ideias em avaliação', value: '7', hint: '3 alto impacto' },
      { label: 'Insights novos', value: '12', hint: 'Últimos 7 dias' },
    ],
    modules: [
      { title: 'Metas & OKRs', description: 'Objetivos e resultados-chave', route: '/strategy/goals', icon: Target, meta: '6 ativos', tone: 'green' },
      { title: 'Ideias', description: 'Inbox, avaliação e iniciativas', route: '/strategy/ideas', icon: Lightbulb, meta: '18 na caixa', tone: 'orange' },
      { title: 'Relatórios', description: 'Resultados, riscos e progresso', route: '/strategy/reports', icon: BarChart3, meta: '4 atualizados', tone: 'blue' },
      { title: 'Insights', description: 'Sinais e recomendações da IA', route: '/strategy/insights', icon: Sparkles, meta: '12 novos', tone: 'purple' },
    ],
    activityTitle: 'Decisões em aberto', activities: [
      { title: 'Objetivo comercial abaixo do ritmo', meta: 'Fechar 5 contratos nos EUA · 40%', status: 'Em risco', tone: 'orange', route: '/strategy/goals' },
      { title: 'Ideia com alto impacto e baixo esforço', meta: 'Resumo automático de reuniões', status: 'Priorizar', tone: 'green', route: '/strategy/ideas' },
      { title: 'Novo padrão de atraso identificado', meta: 'Aprovações de cliente representam 42% do desvio', status: 'Insight', tone: 'purple', route: '/strategy/insights' },
    ],
    focusTitle: 'Revisão trimestral em 9 dias', focusDescription: 'Atualize os resultados-chave e registre o nível de confiança.', focusRoute: '/strategy/goals',
  },
  automation: {
    eyebrow: 'Automação', title: 'Operações automáticas', description: 'Agentes, workflows, aprovações e execuções com controle humano.',
    metrics: [
      { label: 'Workflows ativos', value: '9', hint: '96,4% de sucesso' },
      { label: 'Execuções hoje', value: '63', hint: '2 em andamento' },
      { label: 'Aguardando aprovação', value: '3', hint: '1 vence hoje' },
      { label: 'Tempo economizado', value: '28h', hint: 'Este mês' },
    ],
    modules: [
      { title: 'Workflows', description: 'Gatilhos, condições e ações', route: '/automation/workflows', icon: Workflow, meta: '9 ativos', tone: 'green' },
      { title: 'Aprovações', description: 'Revisão humana antes da ação', route: '/automation/approvals', icon: ClipboardCheck, meta: '3 pendentes', tone: 'orange' },
      { title: 'Execuções', description: 'Logs, custos, falhas e saídas', route: '/automation/runs', icon: History, meta: '63 hoje', tone: 'blue' },
      { title: 'Assistente', description: 'Pergunte sobre todo o workspace', route: '/automation/assistant', icon: Bot, meta: 'Pronto', tone: 'purple' },
    ],
    activityTitle: 'Execuções recentes', activities: [
      { title: 'Qualificação de lead concluída', meta: 'ClearView Cleaning · 38 segundos', status: 'Concluída', tone: 'green', route: '/automation/runs' },
      { title: 'Email preparado para aprovação', meta: 'Acme Flooring · workflow comercial', status: 'Revisar', tone: 'orange', route: '/automation/approvals' },
      { title: 'Scraper retomou a coleta', meta: 'Mercado Livre · 39 novos registros', status: 'Normalizado', tone: 'blue', route: '/automation/runs' },
    ],
    focusTitle: '1 execução requer revisão', focusDescription: 'O enriquecimento do lead terminou com dados incompletos.', focusRoute: '/automation/runs',
  },
  knowledge: {
    eyebrow: 'Conhecimento', title: 'Base operacional', description: 'Arquivos, processos, templates e conteúdo organizados no mesmo lugar.',
    metrics: [
      { label: 'Documentos', value: '248', hint: '14 novos no mês' },
      { label: 'Processos publicados', value: '36', hint: '5 para revisar' },
      { label: 'Templates ativos', value: '18', hint: '4 mais usados' },
      { label: 'Armazenamento', value: '62%', hint: '18,6 GB de 30 GB' },
    ],
    modules: [
      { title: 'Arquivos', description: 'Documentos, versões e permissões', route: '/knowledge/files', icon: Files, meta: '248 itens', tone: 'blue' },
      { title: 'Processos & Wiki', description: 'Procedimentos e conhecimento', route: '/knowledge/processes', icon: BookOpenText, meta: '36 publicados', tone: 'green' },
      { title: 'Templates', description: 'Modelos reutilizáveis', route: '/knowledge/templates', icon: FileText, meta: '18 ativos', tone: 'orange' },
      { title: 'Conteúdo', description: 'Planejamento editorial e aprovações', route: '/knowledge/content', icon: Sparkles, meta: '28 planejados', tone: 'purple' },
    ],
    activityTitle: 'Atualizações recentes', activities: [
      { title: 'Onboarding de cliente atualizado', meta: 'Operações · versão 4', status: 'Publicado', tone: 'green', route: '/knowledge/processes' },
      { title: 'Contrato padrão precisa de revisão', meta: 'Jurídico · revisão vencida há 4 dias', status: 'Revisar', tone: 'orange', route: '/knowledge/templates' },
      { title: '12 arquivos enviados ao Portal Northstar', meta: 'Projeto · há 1 hora', status: 'Novo', tone: 'blue', route: '/knowledge/files' },
    ],
    focusTitle: '5 processos precisam de revisão', focusDescription: 'Defina responsáveis e datas para manter a base confiável.', focusRoute: '/knowledge/processes',
  },
  admin: {
    eyebrow: 'Administração', title: 'Controle do workspace', description: 'Pessoas, segurança, integrações, finanças e preferências.',
    metrics: [
      { label: 'Membros ativos', value: '18', hint: '2 convites pendentes' },
      { label: '2FA habilitado', value: '83%', hint: '3 pessoas pendentes' },
      { label: 'Integrações', value: '6', hint: 'Todas operacionais' },
      { label: 'Plano', value: 'Pro', hint: 'Renova em 18 dias' },
    ],
    modules: [
      { title: 'Membros', description: 'Pessoas, funções e permissões', route: '/admin/members', icon: UsersRound, meta: '18 ativos', tone: 'blue' },
      { title: 'Finanças', description: 'Receitas, despesas e margens', route: '/admin/finance', icon: CreditCard, meta: 'R$ 48,2k', tone: 'green' },
      { title: 'Integrações', description: 'Serviços e sincronizações', route: '/admin/integrations', icon: PlugZap, meta: '6 conectadas', tone: 'purple' },
      { title: 'Segurança', description: '2FA, sessões e políticas', route: '/admin/security', icon: ShieldCheck, meta: '83% 2FA', tone: 'orange' },
    ],
    activityTitle: 'Administração recente', activities: [
      { title: 'Novo convite enviado', meta: 'Designer · acesso Member', status: 'Pendente', tone: 'orange', route: '/admin/members' },
      { title: 'Google Calendar sincronizado', meta: '12 minutos atrás', status: 'Saudável', tone: 'green', route: '/admin/integrations' },
      { title: 'Nova sessão identificada', meta: 'Chrome · São Paulo, BR', status: 'Verificada', tone: 'blue', route: '/admin/security' },
    ],
    focusTitle: '3 membros ainda sem 2FA', focusDescription: 'A política do workspace recomenda autenticação em duas etapas.', focusRoute: '/admin/security',
  },
}

export function GroupOverviewPage({ type }: { type: keyof typeof configs }) {
  const navigate = useNavigate()
  const config = configs[type]
  return (
    <div className="page page--wide overview-page">
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description} actions={<Button variant="primary" onClick={() => navigate(config.modules[0].route)}>Abrir área principal <ArrowRight size={15} /></Button>} />
      <div className="overview-metric-grid">{config.metrics.map((metric) => <Card className="overview-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.hint}</small></Card>)}</div>
      <section className="overview-section"><div className="section-heading"><div><span className="eyebrow">Áreas conectadas</span><h2>Visão geral</h2></div></div><div className="overview-module-grid">{config.modules.map(({ title, description, route, icon: Icon, meta, tone }) => <button className="overview-module" key={title} onClick={() => navigate(route)}><span className={`overview-module__icon overview-module__icon--${tone}`}><Icon size={19} /></span><span><strong>{title}</strong><small>{description}</small><em>{meta}</em></span><ArrowRight size={15} /></button>)}</div></section>
      <div className="overview-content-grid">
        <Card className="overview-activity-card"><div className="card-heading-row"><div><h2>{config.activityTitle}</h2><p>Itens que precisam de contexto ou decisão.</p></div></div><div className="overview-activity-list">{config.activities.map((item) => <button key={item.title} onClick={() => navigate(item.route)}><span className={`activity-dot activity-dot--${item.tone}`} /><span><strong>{item.title}</strong><small>{item.meta}</small></span><Badge tone={item.tone}>{item.status}</Badge><ArrowRight size={14} /></button>)}</div></Card>
        <Card className="overview-focus-card"><span className="overview-focus-card__icon"><CircleAlert size={20} /></span><span className="eyebrow">Próxima melhor ação</span><h2>{config.focusTitle}</h2><p>{config.focusDescription}</p><Button variant="primary" onClick={() => navigate(config.focusRoute)}>Resolver agora <ArrowRight size={15} /></Button><div className="overview-focus-card__meta"><span><Clock3 size={14} /> 6 min estimados</span><span><Sparkles size={14} /> Prioridade alta</span></div></Card>
      </div>
    </div>
  )
}
