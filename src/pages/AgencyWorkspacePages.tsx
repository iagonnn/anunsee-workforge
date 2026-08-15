import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BarChart3, BellRing, Blocks, Building2,
  CalendarClock, Check, CheckCircle2, ChevronRight, Circle, CircleAlert, Clock3,
  ExternalLink, FileCheck2, FileText, Filter, FolderOpen, Gauge, LayoutDashboard,
  ListChecks, MessageSquareText, MoreHorizontal, Plus, Search, Send, ShieldCheck,
  Sparkles, Target, UsersRound, X,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, Modal } from '../components/ui'
import { useApp } from '../context/AppContext'
import {
  agencyProjects, approvalSeed, clientAccounts, portalFiles, projectUpdates,
  type AgencyProject, type ApprovalItem, type ProjectHealth,
} from '../data/workspaceData'

function healthTone(health: ProjectHealth): 'green' | 'orange' | 'red' {
  if (health === 'Saudável') return 'green'
  if (health === 'Atenção') return 'orange'
  return 'red'
}

function WorkspaceHeading({ eyebrow, title, description, actions }: {
  eyebrow: string
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <header className="workspace-heading">
      <div>
        <span className="workspace-heading__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="workspace-heading__actions">{actions}</div> : null}
    </header>
  )
}

export function AgencyDashboardPage() {
  const navigate = useNavigate()
  const { openTaskComposer } = useApp()
  const urgentProjects = agencyProjects.filter((project) => project.health !== 'Saudável' || project.waitingForClient)

  return (
    <div className="page page--wide ops-dashboard">
      <WorkspaceHeading
        eyebrow="ANUNSEE · Centro de operação"
        title="O que move a agência hoje"
        description="Projetos, decisões e clientes reunidos pela próxima ação, não por módulos isolados."
        actions={(
          <>
            <Button onClick={() => navigate('/portal/lucy-services')}><ExternalLink size={15} /> Ver como cliente</Button>
            <Button variant="primary" onClick={openTaskComposer}><Plus size={16} /> Nova tarefa</Button>
          </>
        )}
      />

      <section className="ops-command-grid">
        <article className="daily-command">
          <div className="daily-command__topline">
            <span><Activity size={14} /> Sábado, 15 de agosto</span>
            <Badge tone="green">Operação ativa</Badge>
          </div>
          <div className="daily-command__copy">
            <span className="daily-command__kicker">Foco recomendado</span>
            <h2>Publicar o primeiro checkpoint do WorkForge e liberar duas decisões de clientes.</h2>
            <p>As próximas ações estão organizadas por impacto e dependência. O que depende de você aparece primeiro.</p>
          </div>
          <div className="daily-command__actions">
            <Button variant="primary" onClick={() => navigate('/execution/projects/workforge-v06')}>Abrir projeto principal <ArrowRight size={15} /></Button>
            <button onClick={() => navigate('/automation/approvals')}>2 aprovações aguardando <ChevronRight size={14} /></button>
          </div>
          <div className="daily-command__signal">
            <span>Progresso da semana</span>
            <strong>68%</strong>
            <i><b style={{ width: '68%' }} /></i>
            <small>17 de 25 ações concluídas</small>
          </div>
        </article>

        <aside className="attention-dock">
          <header>
            <div><span className="eyebrow">Precisa de você</span><h2>Fila de decisão</h2></div>
            <span className="attention-dock__count">{urgentProjects.length + 1}</span>
          </header>
          <div className="attention-dock__list">
            <button onClick={() => navigate('/automation/approvals')}>
              <span className="attention-icon attention-icon--violet"><FileCheck2 size={16} /></span>
              <span><strong>Campanha da Lucy</strong><small>Aprovação externa aguardando · hoje</small></span>
              <ChevronRight size={15} />
            </button>
            <button onClick={() => navigate('/execution/projects/rr-cro')}>
              <span className="attention-icon attention-icon--orange"><CircleAlert size={16} /></span>
              <span><strong>Formulário da R&R</strong><small>Projeto requer revisão interna</small></span>
              <ChevronRight size={15} />
            </button>
            <button onClick={() => navigate('/execution/projects/workforge-v06')}>
              <span className="attention-icon attention-icon--lime"><Blocks size={16} /></span>
              <span><strong>Checkpoint WorkForge</strong><small>Build e publicação pendentes</small></span>
              <ChevronRight size={15} />
            </button>
          </div>
          <footer><button onClick={() => navigate('/execution/tasks')}>Abrir todas as prioridades <ArrowRight size={14} /></button></footer>
        </aside>
      </section>

      <section className="ops-section">
        <header className="ops-section__heading">
          <div><span className="eyebrow">Portfólio vivo</span><h2>Projetos em movimento</h2></div>
          <button onClick={() => navigate('/execution/projects')}>Ver portfólio completo <ArrowRight size={14} /></button>
        </header>
        <div className="project-radar">
          {agencyProjects.map((project) => (
            <button className={`project-radar__item project-radar__item--${project.accent}`} key={project.id} onClick={() => navigate(`/execution/projects/${project.id}`)}>
              <span className="project-radar__identity"><i>{project.ownerInitials}</i><span><strong>{project.name}</strong><small>{project.client}</small></span></span>
              <span className="project-radar__phase"><small>Fase atual</small><strong>{project.phase}</strong></span>
              <span className="project-radar__progress"><i><b style={{ width: `${project.progress}%` }} /></i><strong>{project.progress}%</strong></span>
              <span className="project-radar__next"><small>Próximo marco</small><strong>{project.nextMilestone}</strong></span>
              <Badge tone={healthTone(project.health)}>{project.health}</Badge>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <section className="ops-bottom-grid">
        <article className="week-map">
          <header><div><span className="eyebrow">Ritmo da semana</span><h2>Capacidade e entregas</h2></div><Badge tone="blue">2 pessoas</Badge></header>
          <div className="week-map__days">
            {[
              ['SEG', 62, 3], ['TER', 78, 5], ['QUA', 84, 6], ['QUI', 54, 4], ['SEX', 72, 5], ['SÁB', 38, 2],
            ].map(([day, load, deliveries]) => (
              <div key={day as string}><span>{day}</span><i><b style={{ height: `${load}%` }} /></i><strong>{deliveries}</strong><small>ações</small></div>
            ))}
          </div>
        </article>
        <article className="client-pulse">
          <header><div><span className="eyebrow">Relacionamento</span><h2>Pulso dos clientes</h2></div><button onClick={() => navigate('/relationships/clients-legacy')}>Abrir clientes</button></header>
          <div>
            {clientAccounts.slice(0, 3).map((client) => (
              <button key={client.id} onClick={() => navigate(`/relationships/clients/${client.id}`)}>
                <span className="client-pulse__logo">{client.initials}</span>
                <span><strong>{client.name}</strong><small>Atualizado {client.lastUpdate.toLowerCase()}</small></span>
                <Badge tone={healthTone(client.health)}>{client.health}</Badge>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

const projectFilters = ['Todos', 'Aguardando cliente', 'Em atenção', 'Internos'] as const

export function ProjectsWorkspacePage() {
  const navigate = useNavigate()
  const { notify } = useApp()
  const [projects, setProjects] = useState(agencyProjects)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>('Todos')
  const [createOpen, setCreateOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', client: '' })

  const filtered = projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.client}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'Todos'
      || (filter === 'Aguardando cliente' && project.waitingForClient)
      || (filter === 'Em atenção' && project.health !== 'Saudável')
      || (filter === 'Internos' && project.client === 'ANUNSEE')
    return matchesQuery && matchesFilter
  })

  const createProject = () => {
    if (!newProject.name.trim() || !newProject.client.trim()) return
    const project: AgencyProject = {
      ...agencyProjects[3], id: `project-${Date.now()}`, name: newProject.name.trim(), client: newProject.client.trim(),
      clientId: `client-${Date.now()}`, summary: 'Projeto recém-criado. Defina o resultado esperado e a primeira entrega.',
      progress: 0, phase: 'Descoberta', health: 'Saudável', openTasks: 0, waitingForClient: false,
      portalEnabled: false, due: 'A definir', nextMilestone: 'Definir kickoff', nextMilestoneDate: 'Sem data',
      stages: ['Descoberta', 'Planejamento', 'Produção', 'Validação', 'Publicado'].map((label, index) => ({ label, status: index === 0 ? 'current' : 'next' })) as AgencyProject['stages'],
    }
    setProjects((current) => [project, ...current])
    setCreateOpen(false)
    setNewProject({ name: '', client: '' })
    notify('Projeto criado nesta demonstração.', 'success')
  }

  return (
    <div className="page page--wide project-workspace">
      <WorkspaceHeading
        eyebrow="Operação · Projetos"
        title="Portfólio da agência"
        description="Cada linha mostra onde o projeto está, o que o bloqueia e qual é a próxima entrega."
        actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Novo projeto</Button>}
      />

      <div className="portfolio-toolbar">
        <div className="portfolio-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por projeto ou cliente" /></div>
        <div className="portfolio-filters">{projectFilters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <button className="portfolio-filter-button"><Filter size={15} /> Filtros</button>
      </div>

      <section className="portfolio-layout">
        <div className="project-ledger">
          <header className="project-ledger__header"><span>Projeto</span><span>Jornada</span><span>Próxima entrega</span><span>Saúde</span><span /></header>
          {filtered.map((project) => (
            <button className={`project-ledger__row project-ledger__row--${project.accent}`} key={project.id} onClick={() => navigate(`/execution/projects/${project.id}`)}>
              <span className="project-ledger__identity"><i>{project.ownerInitials}</i><span><strong>{project.name}</strong><small>{project.client} · {project.openTasks} tarefas abertas</small></span></span>
              <span className="stage-track">
                {project.stages.map((stage) => <i className={`stage-track__step stage-track__step--${stage.status}`} key={stage.label}><b /><small>{stage.label}</small></i>)}
              </span>
              <span className="project-ledger__milestone"><strong>{project.nextMilestone}</strong><small>{project.nextMilestoneDate}</small></span>
              <span><Badge tone={healthTone(project.health)}>{project.health}</Badge>{project.waitingForClient ? <small className="waiting-label">Cliente</small> : null}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        <aside className="portfolio-insight">
          <div className="portfolio-insight__score"><span><Gauge size={16} /> Saúde do portfólio</span><strong>86</strong><small>/100</small><i><b style={{ width: '86%' }} /></i></div>
          <div className="portfolio-insight__stats">
            <div><strong>{projects.length}</strong><span>projetos ativos</span></div>
            <div><strong>{projects.filter((project) => project.waitingForClient).length}</strong><span>aguardando cliente</span></div>
            <div><strong>{projects.reduce((total, project) => total + project.openTasks, 0)}</strong><span>tarefas abertas</span></div>
          </div>
          <section><span className="eyebrow">Leitura operacional</span><h3>O portfólio está saudável, mas a aprovação externa concentra o próximo risco.</h3><p>Priorize o que libera a produção antes de abrir novas frentes.</p></section>
        </aside>
      </section>

      {createOpen ? (
        <Modal title="Novo projeto" description="Comece pelo cliente e pelo resultado esperado. A estrutura detalhada vem depois." onClose={() => setCreateOpen(false)}>
          <div className="composer-form">
            <label className="field field--full"><span>Nome do projeto</span><input autoFocus value={newProject.name} onChange={(event) => setNewProject((current) => ({ ...current, name: event.target.value }))} placeholder="Ex.: Reestruturação do site" /></label>
            <label className="field field--full"><span>Cliente</span><input value={newProject.client} onChange={(event) => setNewProject((current) => ({ ...current, client: event.target.value }))} placeholder="Nome da empresa" /></label>
            <div className="form-grid"><label className="field"><span>Responsável</span><select><option>Iago</option><option>Luigi</option></select></label><label className="field"><span>Modelo</span><select><option>Projeto sob medida</option><option>Site demonstrativo</option><option>Cliente ativo</option></select></label></div>
            <div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!newProject.name.trim() || !newProject.client.trim()} onClick={createProject}>Criar projeto</Button></div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

const projectTabs = ['Visão geral', 'Tarefas', 'Aprovações', 'Arquivos', 'Histórico'] as const

export function ProjectWorkspaceDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { openTaskComposer } = useApp()
  const project = agencyProjects.find((item) => item.id === projectId) ?? agencyProjects[0]
  const [tab, setTab] = useState<(typeof projectTabs)[number]>('Visão geral')

  return (
    <div className="page page--wide project-cockpit">
      <button className="project-cockpit__back" onClick={() => navigate('/execution/projects')}><ArrowLeft size={15} /> Voltar ao portfólio</button>
      <header className={`project-cockpit__hero project-cockpit__hero--${project.accent}`}>
        <div className="project-cockpit__identity">
          <span className="project-cockpit__mark">{project.ownerInitials}</span>
          <div><span>{project.client}</span><h1>{project.name}</h1><p>{project.summary}</p></div>
        </div>
        <div className="project-cockpit__actions">
          {project.portalEnabled ? <Button onClick={() => navigate(`/portal/${project.clientId}/project/${project.id}`)}><ExternalLink size={15} /> Abrir portal</Button> : null}
          <Button variant="primary" onClick={openTaskComposer}><Plus size={15} /> Nova tarefa</Button>
        </div>
        <div className="project-cockpit__progress"><span><strong>{project.progress}%</strong><small>progresso consolidado</small></span><i><b style={{ width: `${project.progress}%` }} /></i><Badge tone={healthTone(project.health)}>{project.health}</Badge></div>
      </header>

      <div className="project-stage-ribbon">
        {project.stages.map((stage, index) => (
          <div className={`project-stage-ribbon__item project-stage-ribbon__item--${stage.status}`} key={stage.label}>
            <span>{stage.status === 'done' ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span>
            <div><small>{stage.status === 'current' ? 'Fase atual' : stage.status === 'done' ? 'Concluída' : 'Próxima'}</small><strong>{stage.label}</strong></div>
          </div>
        ))}
      </div>

      <nav className="project-cockpit__tabs">{projectTabs.map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}{item === 'Aprovações' && project.waitingForClient ? <i /> : null}</button>)}</nav>

      {tab === 'Visão geral' ? <ProjectOverview project={project} onOpenTab={setTab} /> : null}
      {tab === 'Tarefas' ? <ProjectTaskBoard onCreate={openTaskComposer} /> : null}
      {tab === 'Aprovações' ? <ProjectApprovals project={project} onOpen={() => navigate('/automation/approvals')} /> : null}
      {tab === 'Arquivos' ? <ProjectFiles /> : null}
      {tab === 'Histórico' ? <ProjectHistory /> : null}
    </div>
  )
}

function ProjectOverview({ project, onOpenTab }: { project: AgencyProject; onOpenTab: (tab: (typeof projectTabs)[number]) => void }) {
  return (
    <section className="project-overview-grid">
      <div className="project-overview-main">
        <article className="next-milestone-panel">
          <span className="next-milestone-panel__icon"><Target size={19} /></span>
          <div><span className="eyebrow">Próximo marco</span><h2>{project.nextMilestone}</h2><p>O projeto avança quando essa entrega for concluída e registrada.</p></div>
          <span className="next-milestone-panel__date"><CalendarClock size={15} /> {project.nextMilestoneDate}</span>
        </article>
        <article className="workstream-panel">
          <header><div><span className="eyebrow">Trabalho em curso</span><h2>Frentes desta etapa</h2></div><button onClick={() => onOpenTab('Tarefas')}>Abrir quadro <ArrowRight size={14} /></button></header>
          <div className="workstream-list">
            <div><span className="workstream-list__status workstream-list__status--active"><Sparkles size={15} /></span><span><strong>Refinar a experiência principal</strong><small>Iago · em andamento</small></span><Badge tone="purple">Produção</Badge></div>
            <div><span className="workstream-list__status"><Circle size={15} /></span><span><strong>Validar conteúdo e assets</strong><small>Luigi · próxima ação</small></span><Badge tone="blue">Revisão</Badge></div>
            <div><span className="workstream-list__status workstream-list__status--done"><Check size={15} /></span><span><strong>Consolidar diagnóstico</strong><small>Concluída em 12 ago</small></span><Badge tone="green">Feito</Badge></div>
          </div>
        </article>
        <article className="project-activity-panel">
          <header><div><span className="eyebrow">Linha do tempo</span><h2>Atualizações recentes</h2></div><button onClick={() => onOpenTab('Histórico')}>Ver histórico</button></header>
          <div>{projectUpdates.map((update) => <div key={update.id}><span className={`activity-dot activity-dot--${update.type}`} /><span><strong>{update.title}</strong><small>{update.detail}</small></span><time>{update.time}</time></div>)}</div>
        </article>
      </div>
      <aside className="project-context-rail">
        {project.waitingForClient ? (
          <article className="client-waiting-card"><span><BellRing size={17} /> Aguardando cliente</span><h3>Existe uma decisão externa bloqueando a próxima etapa.</h3><button onClick={() => onOpenTab('Aprovações')}>Ver aprovação <ArrowRight size={14} /></button></article>
        ) : null}
        <article className="project-facts-card"><span className="eyebrow">Contexto</span><div><span>Responsável</span><strong><Avatar name={project.owner} size="sm" /> {project.owner}</strong></div><div><span>Prazo atual</span><strong>{project.due}</strong></div><div><span>Tarefas abertas</span><strong>{project.openTasks}</strong></div><div><span>Portal do cliente</span><strong>{project.portalEnabled ? 'Ativo' : 'Desativado'}</strong></div></article>
        <article className="project-team-card"><span className="eyebrow">Equipe</span><div><span className="mini-avatar">IA</span><span><strong>Iago</strong><small>Estratégia e operação</small></span></div><div><span className="mini-avatar">LU</span><span><strong>Luigi</strong><small>Produção visual</small></span></div><button>Gerenciar acesso</button></article>
      </aside>
    </section>
  )
}

function ProjectTaskBoard({ onCreate }: { onCreate: () => void }) {
  const columns = [
    { title: 'A fazer', tone: 'neutral', tasks: ['Definir critérios de aceite', 'Organizar arquivos do cliente'] },
    { title: 'Em produção', tone: 'purple', tasks: ['Refinar experiência principal', 'Aplicar conteúdo aprovado'] },
    { title: 'Revisão', tone: 'orange', tasks: ['Validar versão responsiva'] },
    { title: 'Concluído', tone: 'green', tasks: ['Consolidar diagnóstico', 'Definir escopo da etapa'] },
  ]
  return <section className="cockpit-task-board"><header><div><span className="eyebrow">Execução</span><h2>Quadro do projeto</h2></div><Button variant="primary" onClick={onCreate}><Plus size={15} /> Nova tarefa</Button></header><div>{columns.map((column) => <section key={column.title}><header><span><i className={`task-column-dot task-column-dot--${column.tone}`} />{column.title}</span><Badge>{column.tasks.length}</Badge></header>{column.tasks.map((task, index) => <article key={task}><span className="task-drag-handle">··</span><Badge tone={index === 0 && column.title !== 'Concluído' ? 'orange' : 'neutral'}>{index === 0 ? 'Alta' : 'Média'}</Badge><h3>{task}</h3><footer><span className="mini-avatar">{index % 2 ? 'LU' : 'IA'}</span><span><Clock3 size={12} /> {column.title === 'Concluído' ? 'Concluída' : '18 ago'}</span></footer></article>)}<button onClick={onCreate}><Plus size={14} /> Adicionar</button></section>)}</div></section>
}

function ProjectApprovals({ project, onOpen }: { project: AgencyProject; onOpen: () => void }) {
  const approvals = approvalSeed.filter((item) => item.projectId === project.id)
  return <section className="project-approval-panel"><header><div><span className="eyebrow">Decisões compartilhadas</span><h2>Aprovações deste projeto</h2><p>O cliente enxerga somente o material liberado nesta área.</p></div><Button variant="primary" onClick={onOpen}>Abrir central</Button></header><div>{approvals.length ? approvals.map((item) => <button key={item.id} onClick={onOpen}><span className="approval-file-icon"><FileCheck2 size={18} /></span><span><strong>{item.title}</strong><small>{item.previewLabel} · {item.version}</small></span><Badge tone={item.status === 'Aprovado' ? 'green' : 'orange'}>{item.status}</Badge><span>{item.due}</span><ChevronRight size={15} /></button>) : <div className="project-empty-state"><ShieldCheck size={24} /><h3>Nenhuma aprovação criada</h3><p>Quando uma entrega precisar da decisão do cliente, ela aparecerá aqui.</p></div>}</div></section>
}

function ProjectFiles() {
  return <section className="project-files-panel"><header><div><span className="eyebrow">Biblioteca do projeto</span><h2>Arquivos organizados por entrega</h2></div><Button variant="primary"><Plus size={15} /> Enviar arquivo</Button></header><div className="project-file-groups"><aside><button className="active"><FolderOpen size={15} /> Todos os arquivos <span>12</span></button><button><FolderOpen size={15} /> Estratégia <span>3</span></button><button><FolderOpen size={15} /> Produção <span>6</span></button><button><FolderOpen size={15} /> Entregas finais <span>3</span></button></aside><div className="project-file-list">{portalFiles.map((file) => <button key={file.id}><span className={`file-type file-type--${file.type.toLowerCase()}`}>{file.type}</span><span><strong>{file.name}</strong><small>{file.size} · atualizado {file.updated.toLowerCase()}</small></span><MoreHorizontal size={15} /></button>)}</div></div></section>
}

function ProjectHistory() {
  return <section className="project-history-panel"><header><span className="eyebrow">Registro operacional</span><h2>Histórico completo</h2><p>Decisões, mudanças e entregas permanecem conectadas ao projeto.</p></header><div>{[...projectUpdates, ...projectUpdates.map((item, index) => ({ ...item, id: `${item.id}-old-${index}`, time: `${10 - index} ago` }))].map((update) => <article key={update.id}><time>{update.time}</time><span className={`activity-dot activity-dot--${update.type}`} /><div><strong>{update.title}</strong><p>{update.detail}</p><small>{update.author}</small></div></article>)}</div></section>
}

export function ApprovalCenterPage() {
  const { notify } = useApp()
  const [items, setItems] = useState(approvalSeed)
  const [selectedId, setSelectedId] = useState(items.find((item) => item.status === 'Aguardando')?.id ?? items[0].id)
  const [note, setNote] = useState('')
  const selected = items.find((item) => item.id === selectedId) ?? items[0]

  const setStatus = (status: ApprovalItem['status']) => {
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, status } : item))
    notify(status === 'Aprovado' ? 'Entrega aprovada nesta demonstração.' : 'Solicitação de alteração registrada.', 'success')
    setNote('')
  }

  return (
    <div className="page page--wide approval-center">
      <WorkspaceHeading eyebrow="Projetos · Aprovações" title="Central de decisões" description="Uma fila própria para revisar entregas, registrar contexto e liberar o próximo estágio." />
      <section className="approval-workbench">
        <aside className="approval-queue">
          <header><div><span className="eyebrow">Fila compartilhada</span><h2>{items.filter((item) => item.status === 'Aguardando').length} aguardando</h2></div><button><Filter size={15} /></button></header>
          <div>{items.map((item) => <button className={selected.id === item.id ? 'active' : ''} key={item.id} onClick={() => setSelectedId(item.id)}><span className={`approval-queue__status approval-queue__status--${item.status === 'Aprovado' ? 'approved' : item.status === 'Alterações solicitadas' ? 'changes' : 'waiting'}`} /> <span><strong>{item.title}</strong><small>{item.client} · {item.version}</small><time>{item.requestedAt}</time></span><ChevronRight size={15} /></button>)}</div>
        </aside>
        <article className="approval-reviewer">
          <header><div><span>{selected.type} · {selected.version}</span><h2>{selected.title}</h2><p>{selected.project} · {selected.client}</p></div><Badge tone={selected.status === 'Aprovado' ? 'green' : selected.status === 'Alterações solicitadas' ? 'red' : 'orange'}>{selected.status}</Badge></header>
          <div className="approval-reviewer__canvas">
            <div className="approval-document">
              <header><span>ANUNSEE</span><small>{selected.previewLabel}</small></header>
              <div className="approval-document__hero"><span>ENTREGA PARA REVISÃO</span><h3>{selected.title}</h3><p>{selected.description}</p></div>
              <div className="approval-document__blocks"><i /><i /><i /></div>
              <footer><span>{selected.client}</span><span>{selected.version}</span></footer>
            </div>
          </div>
          <section className="approval-reviewer__context"><div><span className="eyebrow">O que está sendo decidido</span><p>{selected.description}</p></div><div><span>Prazo da decisão</span><strong>{selected.due}</strong></div></section>
          <div className="approval-comment"><MessageSquareText size={16} /><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="Registre uma observação antes de decidir..." /></div>
          <footer><Button onClick={() => setStatus('Alterações solicitadas')}><X size={15} /> Solicitar alterações</Button><Button variant="primary" onClick={() => setStatus('Aprovado')}><Check size={15} /> Aprovar entrega</Button></footer>
        </article>
      </section>
    </div>
  )
}

export function ClientsWorkspacePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(clientAccounts[0].id)
  const selected = clientAccounts.find((client) => client.id === selectedId) ?? clientAccounts[0]
  const projects = agencyProjects.filter((project) => project.clientId === selected.id)
  const filtered = clientAccounts.filter((client) => `${client.name} ${client.segment}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page page--wide client-workspace">
      <WorkspaceHeading eyebrow="Relacionamento · Clientes" title="Contas e projetos" description="O cliente deixa de ser uma ficha solta e passa a concentrar projetos, conversas, arquivos e acesso ao portal." actions={<Button variant="primary"><Plus size={15} /> Novo cliente</Button>} />
      <section className="client-master-detail">
        <aside className="client-directory">
          <div className="client-directory__search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente" /></div>
          <div>{filtered.map((client) => <button className={client.id === selected.id ? 'active' : ''} key={client.id} onClick={() => setSelectedId(client.id)}><span className="client-directory__logo">{client.initials}</span><span><strong>{client.name}</strong><small>{client.segment}</small></span><i className={`client-health-dot client-health-dot--${healthTone(client.health)}`} /></button>)}</div>
        </aside>
        <article className="client-account-view">
          <header><div className="client-account-view__identity"><span>{selected.initials}</span><div><Badge tone={healthTone(selected.health)}>{selected.health}</Badge><h2>{selected.name}</h2><p>{selected.segment} · {selected.location}</p></div></div><div>{selected.portalEnabled ? <Button onClick={() => navigate(`/portal/${selected.id}`)}><ExternalLink size={15} /> Abrir portal</Button> : <Button>Ativar portal</Button>}<Button variant="primary"><Send size={15} /> Enviar mensagem</Button></div></header>
          <div className="client-account-view__facts"><div><span>Contato principal</span><strong>{selected.contact}</strong></div><div><span>Relacionamento</span><strong>{selected.activeSince}</strong></div><div><span>Projetos</span><strong>{selected.projects}</strong></div><div><span>Última atualização</span><strong>{selected.lastUpdate}</strong></div></div>
          <section className="client-account-view__projects"><header><div><span className="eyebrow">Trabalho conectado</span><h3>Projetos desta conta</h3></div><button>Adicionar projeto</button></header>{projects.length ? projects.map((project) => <button key={project.id} onClick={() => navigate(`/execution/projects/${project.id}`)}><span className={`project-mini-mark project-mini-mark--${project.accent}`}><LayoutDashboard size={16} /></span><span><strong>{project.name}</strong><small>{project.phase} · próximo marco: {project.nextMilestone}</small></span><span className="mini-progress"><i><b style={{ width: `${project.progress}%` }} /></i><strong>{project.progress}%</strong></span><ChevronRight size={15} /></button>) : <div className="client-no-project"><FolderOpen size={22} /><p>Nenhum projeto conectado a esta conta.</p></div>}</section>
          <div className="client-account-bottom"><section><span className="eyebrow">Próxima ação</span><h3>Registrar uma atualização para o cliente</h3><p>O portal ainda não possui uma atualização desta semana.</p><Button>Escrever atualização</Button></section><section><span className="eyebrow">Acesso externo</span><div><ShieldCheck size={19} /><span><strong>{selected.portalEnabled ? 'Portal ativo' : 'Portal desativado'}</strong><small>{selected.portalEnabled ? 'O cliente possui acesso ao próprio ambiente.' : 'Nenhum acesso externo foi liberado.'}</small></span></div><button>{selected.portalEnabled ? 'Gerenciar acesso' : 'Configurar portal'}</button></section></div>
        </article>
      </section>
    </div>
  )
}
