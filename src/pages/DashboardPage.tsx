import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bot, Building2, CalendarClock, Check, CheckCircle2, ChevronRight,
  Circle, Clock3, FileText, FolderKanban, Lightbulb, ListTodo, MessageSquareText,
  Plus, Rocket, Sparkles, Target, UsersRound, Workflow,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, PageHeader } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { WorkspaceModuleId } from '../types/workspace'

const shortcuts: Array<{ module: WorkspaceModuleId; label: string; description: string; route: string; icon: LucideIcon; tone: string }> = [
  { module: 'companies', label: 'Empresas', description: 'Relacionamentos e oportunidades', route: '/crm/companies', icon: Building2, tone: 'amber' },
  { module: 'projects', label: 'Projetos', description: 'Execução e entregas', route: '/execution/projects', icon: FolderKanban, tone: 'blue' },
  { module: 'tasks', label: 'Tarefas', description: 'Trabalho e prioridades', route: '/execution/tasks', icon: ListTodo, tone: 'green' },
  { module: 'reports', label: 'Relatórios', description: 'Resultados da operação', route: '/reports', icon: Target, tone: 'purple' },
  { module: 'calendar', label: 'Calendário', description: 'Agenda e decisões', route: '/calendar', icon: CalendarClock, tone: 'orange' },
  { module: 'sites', label: 'Sites e formulários', description: 'Captação e formulários', route: '/sites', icon: FileText, tone: 'slate' },
  { module: 'automations', label: 'Automações', description: 'Agentes e workflows', route: '/automation/workflows', icon: Workflow, tone: 'violet' },
  { module: 'marketing', label: 'Marketing', description: 'Campanhas e conteúdo', route: '/marketing', icon: Lightbulb, tone: 'rose' },
]

const tasks = [
  { title: 'Revisar proposta comercial', relation: 'Horizonte Arquitetura · Proposta', due: 'Hoje, 11:00', priority: 'Alta', owner: 'IR', done: false },
  { title: 'Aprovar conteúdo do portal', relation: 'Clínica Aurora · Campanha', due: 'Hoje, 14:30', priority: 'Média', owner: 'SM', done: false },
  { title: 'Preparar pauta da reunião', relation: 'Equipe · Reunião semanal', due: 'Hoje, 16:00', priority: 'Média', owner: 'MC', done: false },
  { title: 'Validar mapeamento do CSV', relation: 'Importação · Operação', due: 'Amanhã', priority: 'Baixa', owner: 'EW', done: true },
]

const meetings = [
  { time: '10:00', title: 'Daily da operação', meta: 'Equipe interna · 25 min', avatars: ['IR', 'MC', 'EW'] },
  { time: '14:30', title: 'Kickoff NovaVia', meta: 'Cliente · Google Meet', avatars: ['IR', 'SM'] },
  { time: '17:00', title: 'Revisão de automações', meta: 'IA & Operação · 45 min', avatars: ['IR', 'LP'] },
]

const goals = [
  { name: 'Reduzir o tempo de resposta comercial', progress: 72, meta: 'Operações · Q3', tone: 'green' as const },
  { name: 'Fechar 5 novos contratos', progress: 40, meta: 'Comercial · Q3', tone: 'orange' as const },
  { name: 'Publicar o novo portal', progress: 86, meta: 'Produto · Q3', tone: 'purple' as const },
]

const projectTimeline = [
  { name: 'Projeto Horizonte', client: 'Horizonte Arquitetura', start: 4, width: 58, progress: 82, tone: 'blue' },
  { name: 'Automação comercial', client: 'WorkForge', start: 18, width: 52, progress: 47, tone: 'purple' },
  { name: 'Campanha Aurora', client: 'Clínica Aurora', start: 39, width: 46, progress: 64, tone: 'green' },
]

export function DashboardPage() {
  const { setAiOpen, notify, openTaskComposer, workspaceConfig } = useApp()
  const navigate = useNavigate()
  const [taskState, setTaskState] = useState(tasks)
  const visibleShortcuts = shortcuts.filter((shortcut) => workspaceConfig?.enabledModules.includes(shortcut.module) ?? true)
  const companyName = workspaceConfig?.business.name ?? 'seu workspace'
  const [note, setNote] = useState(() => localStorage.getItem('wf-quick-note') ?? 'Revisar a estrutura do CRM e definir o primeiro workflow de análise de leads.')

  useEffect(() => {
    localStorage.setItem('wf-quick-note', note)
  }, [note])

  const completeTask = (title: string) => {
    setTaskState((current) => current.map((task) => task.title === title ? { ...task, done: !task.done } : task))
  }

  return (
    <div className="page page--wide dashboard-page workspace-home">
      <PageHeader
        eyebrow={workspaceConfig?.business.industry ?? 'Escritório conectado'}
        title="Dashboard"
        description={`Visão geral de ${companyName}: clientes, vendas, agenda e execução no mesmo contexto.`}
        actions={<><Button onClick={() => navigate('/execution/meetings?create=1')}><CalendarClock size={16} /> Nova reunião</Button><Button variant="primary" onClick={openTaskComposer}><Plus size={16} /> Nova tarefa</Button></>}
      />

      <Card className="workspace-hero">
        <div className="workspace-hero__copy">
          <span className="workspace-hero__eyebrow"><Sparkles size={14} /> Quarta-feira · foco da operação</span>
          <h2>Bom trabalho, Alex.</h2>
          <p>Há 6 itens para hoje, 2 aprovações de clientes e uma automação aguardando sua revisão.</p>
          <div className="workspace-hero__actions"><Button variant="primary" onClick={() => navigate('/my-work')}>Abrir meu trabalho <ArrowRight size={15} /></Button><Button onClick={() => setAiOpen(true)}><Bot size={15} /> Planejar com IA</Button></div>
        </div>
        <div className="workspace-hero__summary">
          <div><span><CheckCircle2 size={15} /> Concluído</span><strong>18</strong><small>esta semana</small></div>
          <div><span><Clock3 size={15} /> Em andamento</span><strong>12</strong><small>em 4 projetos</small></div>
          <div><span><UsersRound size={15} /> Capacidade</span><strong>78%</strong><small>equipe equilibrada</small></div>
        </div>
      </Card>

      <section className="home-section">
        <div className="home-section__heading"><div><span className="eyebrow">Navegação rápida</span><h2>Seu escritório</h2></div><button className="text-button" onClick={() => notify('Personalização dos atalhos será adicionada.')}>Personalizar</button></div>
        <div className="module-launcher-grid">
          {visibleShortcuts.map(({ label, description, route, icon: Icon, tone }) => (
            <button className={`module-launcher module-launcher--${tone}`} key={label} onClick={() => navigate(route)}>
              <span className="module-launcher__icon"><Icon size={19} /></span>
              <span><strong>{label}</strong><small>{description}</small></span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>

      <div className="home-main-grid">
        <Card className="today-card">
          <div className="card-heading-row">
            <div><h2>Hoje</h2><p>Prioridades organizadas por prazo e impacto.</p></div>
            <div className="segmented-control"><button className="active">Lista</button><button>Agenda</button></div>
          </div>
          <div className="today-task-list">
            {taskState.map((task) => (
              <div className={`today-task ${task.done ? 'today-task--done' : ''}`} key={task.title}>
                <button className="task-check" onClick={() => completeTask(task.title)} aria-label={`${task.done ? 'Reabrir' : 'Concluir'} ${task.title}`}>{task.done ? <Check size={14} /> : <Circle size={15} />}</button>
                <button className="today-task__content" onClick={() => navigate('/execution/tasks')}><strong>{task.title}</strong><small>{task.relation}</small></button>
                <span className="today-task__owner"><Avatar name={task.owner} size="sm" /></span>
                <span className="today-task__due"><strong>{task.due}</strong><small>{task.priority}</small></span>
                <button className="today-task__open" onClick={() => navigate('/execution/tasks')}><ArrowRight size={14} /></button>
              </div>
            ))}
          </div>
          <button className="inline-create" onClick={openTaskComposer}><Plus size={15} /> Adicionar tarefa</button>
        </Card>

        <div className="home-side-stack">
          <Card className="quick-note-card">
            <div className="card-heading-row"><div><h2>Anotação rápida</h2><p>Salva automaticamente neste navegador.</p></div><Badge tone="green">Salvo</Badge></div>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} aria-label="Anotação rápida" />
            <div className="quick-note-card__footer"><span><MessageSquareText size={14} /> Só você pode ver</span><button onClick={openTaskComposer}>Transformar em tarefa</button></div>
          </Card>

          <Card className="meeting-card">
            <div className="card-heading-row"><div><h2>Próximas reuniões</h2><p>Agenda de hoje.</p></div><button className="text-button" onClick={() => navigate('/execution/meetings')}>Ver agenda</button></div>
            <div className="meeting-list">
              {meetings.map((meeting) => <button key={meeting.title} onClick={() => navigate('/execution/meetings')}><span className="meeting-list__time">{meeting.time}</span><span><strong>{meeting.title}</strong><small>{meeting.meta}</small></span><span className="avatar-stack">{meeting.avatars.map((avatar) => <Avatar key={avatar} name={avatar} size="sm" />)}</span></button>)}
            </div>
          </Card>
        </div>
      </div>

      <div className="home-connected-grid">
        <Card className="compact-timeline-card">
          <div className="card-heading-row"><div><h2>Projetos em movimento</h2><p>Uma visão compacta das próximas quatro semanas.</p></div><button className="text-button" onClick={() => navigate('/execution/timeline')}>Abrir Timeline</button></div>
          <div className="compact-timeline__header"><span>Projeto</span><div>{['Esta semana', 'Próxima', 'Semana 3', 'Semana 4'].map((label) => <span key={label}>{label}</span>)}</div></div>
          <div className="compact-timeline__rows">
            {projectTimeline.map((project) => <button key={project.name} onClick={() => navigate('/execution/projects')}><span><strong>{project.name}</strong><small>{project.client}</small></span><div className="compact-timeline__track"><i className={`compact-timeline__bar compact-timeline__bar--${project.tone}`} style={{ left: `${project.start}%`, width: `${project.width}%` }}><b style={{ width: `${project.progress}%` }} /><span>{project.progress}%</span></i></div></button>)}
          </div>
        </Card>

        <Card className="goals-card">
          <div className="card-heading-row"><div><h2>Metas do período</h2><p>Resultados conectados ao trabalho.</p></div><button className="text-button" onClick={() => navigate('/strategy/goals')}>Todos os OKRs</button></div>
          <div className="goal-list">
            {goals.map((goal) => <button key={goal.name} onClick={() => navigate('/strategy/goals')}><span><strong>{goal.name}</strong><small>{goal.meta}</small></span><Badge tone={goal.tone}>{goal.progress}%</Badge><i><b style={{ width: `${goal.progress}%` }} /></i></button>)}
          </div>
        </Card>
      </div>

      <Card className="automation-home-card">
        <div className="automation-home-card__intro"><span className="automation-home-card__icon"><Workflow size={20} /></span><div><span className="eyebrow">Automação em destaque</span><h2>Qualificação automática de leads</h2><p>Pesquisa empresa, enriquece dados, calcula score, prepara email e solicita sua aprovação antes do envio.</p></div></div>
        <div className="automation-home-flow">
          <span><Rocket size={15} /> Novo lead</span><i /><span><Sparkles size={15} /> Analisar</span><i /><span><Bot size={15} /> Preparar contato</span><i /><span><Check size={15} /> Aprovar</span>
        </div>
        <div className="automation-home-card__actions"><div><span className="live-dot" /><strong>Ativa</strong><small>48 execuções · 96% de sucesso</small></div><Button onClick={() => navigate('/automation/workflows')}>Abrir automação <ArrowRight size={15} /></Button></div>
      </Card>
    </div>
  )
}
