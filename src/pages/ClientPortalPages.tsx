import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BadgeCheck, Bell, CalendarClock, Check, CheckCircle2,
  ChevronRight, Circle, Clock3, Download, FileCheck2, FileText, FolderOpen,
  Home, ListChecks, LockKeyhole, Menu, MessageCircle, Paperclip, Send, Sparkles,
  Upload, X,
} from 'lucide-react'
import { approvalSeed, agencyProjects, clientAccounts, portalFiles, type ApprovalItem } from '../data/workspaceData'

function getPortalContext(clientId?: string) {
  const client = clientAccounts.find((item) => item.id === clientId) ?? clientAccounts[0]
  const project = agencyProjects.find((item) => item.clientId === client.id) ?? agencyProjects[0]
  return { client, project }
}

export function ClientPortalShell() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { client, project } = getPortalContext(clientId)
  const [menuOpen, setMenuOpen] = useState(false)
  const base = `/portal/${client.id}`
  const navigation = [
    { label: 'Início', route: base, icon: Home, end: true },
    { label: 'Projeto', route: `${base}/project/${project.id}`, icon: ListChecks },
    { label: 'Aprovações', route: `${base}/approvals`, icon: BadgeCheck, count: approvalSeed.filter((item) => item.clientId === client.id && item.status === 'Aguardando').length },
    { label: 'Arquivos', route: `${base}/files`, icon: FolderOpen },
    { label: 'Mensagens', route: `${base}/messages`, icon: MessageCircle },
  ]

  return (
    <div className="client-portal">
      <header className="portal-topbar">
        <button className="portal-brand" onClick={() => navigate(base)}>
          <span className="portal-brand__agency">A</span>
          <span><strong>ANUNSEE</strong><small>Portal do cliente</small></span>
        </button>
        <nav className={menuOpen ? 'portal-nav portal-nav--open' : 'portal-nav'}>
          {navigation.map(({ label, route, icon: Icon, count, end }) => (
            <NavLink end={end} key={route} to={route} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon size={16} /><span>{label}</span>{count ? <i>{count}</i> : null}
            </NavLink>
          ))}
        </nav>
        <div className="portal-topbar__account">
          <button className="portal-agency-return" onClick={() => navigate('/dashboard')}><ArrowLeft size={14} /> Modo agência</button>
          <button className="portal-notification"><Bell size={17} /><i /></button>
          <span className="portal-client-avatar">{client.initials}</span>
          <button className="portal-menu-button" onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>
      <div className="portal-demo-note"><LockKeyhole size={13} /> Visualização demonstrativa: em produção, cada cliente verá somente os próprios dados.</div>
      <main className="portal-content"><Outlet /></main>
    </div>
  )
}

function PortalHeading({ overline, title, description, action }: { overline: string; title: string; description: string; action?: ReactNode }) {
  return <header className="portal-heading"><div><span>{overline}</span><h1>{title}</h1><p>{description}</p></div>{action ? <div>{action}</div> : null}</header>
}

export function ClientPortalHomePage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { client, project } = getPortalContext(clientId)
  const base = `/portal/${client.id}`
  const approvals = approvalSeed.filter((item) => item.clientId === client.id && item.status === 'Aguardando')

  return (
    <div className="portal-page portal-home">
      <section className={`portal-welcome portal-welcome--${project.accent}`}>
        <div className="portal-welcome__copy">
          <span className="portal-overline">Olá, {client.contact}</span>
          <h1>Seu projeto, sem ruído.</h1>
          <p>Acompanhe o que já foi feito, o que acontece agora e onde precisamos da sua decisão.</p>
          <div><button className="portal-primary-button" onClick={() => navigate(`${base}/project/${project.id}`)}>Ver projeto completo <ArrowRight size={15} /></button>{approvals.length ? <button className="portal-secondary-button" onClick={() => navigate(`${base}/approvals`)}>{approvals.length} aprovação pendente</button> : null}</div>
        </div>
        <div className="portal-progress-orbit" style={{ '--portal-progress': `${project.progress * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{project.progress}%</strong><span>concluído</span></div>
          <small>{project.phase}</small>
        </div>
      </section>

      <section className="portal-next-step">
        <div className="portal-next-step__icon"><Sparkles size={18} /></div>
        <div><span>Próximo passo</span><h2>{project.nextMilestone}</h2><p>Assim que esta etapa for concluída, o projeto avança para a próxima validação.</p></div>
        <time><CalendarClock size={15} /> {project.nextMilestoneDate}</time>
      </section>

      <section className="portal-journey-section">
        <header><div><span className="portal-overline">Jornada do projeto</span><h2>Onde estamos</h2></div><button onClick={() => navigate(`${base}/project/${project.id}`)}>Ver detalhes</button></header>
        <div className="portal-journey">
          {project.stages.map((stage, index) => (
            <div className={`portal-journey__step portal-journey__step--${stage.status}`} key={stage.label}>
              <span>{stage.status === 'done' ? <Check size={14} /> : index + 1}</span>
              <i />
              <div><small>{stage.status === 'done' ? 'Concluída' : stage.status === 'current' ? 'Agora' : 'Em seguida'}</small><strong>{stage.label}</strong></div>
            </div>
          ))}
        </div>
      </section>

      <div className="portal-home-grid">
        <section className="portal-update-feed">
          <header><div><span className="portal-overline">Atualizações</span><h2>O que mudou recentemente</h2></div></header>
          <div>
            <article><span className="portal-update-icon portal-update-icon--done"><CheckCircle2 size={16} /></span><div><strong>Estrutura da campanha concluída</strong><p>Palavras-chave e anúncios estão organizados para sua revisão.</p><time>Hoje, 09:42</time></div></article>
            <article><span className="portal-update-icon portal-update-icon--message"><MessageCircle size={16} /></span><div><strong>Nova atualização da equipe</strong><p>Incluímos uma explicação sobre a próxima fase do projeto.</p><time>Ontem, 18:10</time></div></article>
            <article><span className="portal-update-icon portal-update-icon--file"><FileText size={16} /></span><div><strong>Novo arquivo disponível</strong><p>Plano-de-campanha-v2.pdf foi adicionado ao projeto.</p><time>Ontem, 16:35</time></div></article>
          </div>
        </section>

        <aside className="portal-decision-card">
          <span className="portal-overline">Sua participação</span>
          {approvals.length ? <><div className="portal-decision-card__icon"><FileCheck2 size={21} /></div><h2>Uma entrega precisa da sua decisão</h2><p>{approvals[0].title} está pronta para revisão. Você pode aprovar ou solicitar ajustes com contexto.</p><button className="portal-primary-button" onClick={() => navigate(`${base}/approvals`)}>Revisar agora <ArrowRight size={15} /></button></> : <><div className="portal-decision-card__icon portal-decision-card__icon--done"><Check size={21} /></div><h2>Nada pendente com você</h2><p>A equipe continua trabalhando e avisará quando uma decisão for necessária.</p></>}
        </aside>
      </div>
    </div>
  )
}

export function ClientPortalProjectPage() {
  const { clientId } = useParams()
  const { client, project } = getPortalContext(clientId)
  const [active, setActive] = useState<'escopo' | 'entregas'>('escopo')

  return (
    <div className="portal-page portal-project-page">
      <PortalHeading overline={`${client.name} · Projeto ativo`} title={project.name} description={project.summary} action={<span className="portal-status-pill"><i /> {project.phase}</span>} />
      <section className="portal-project-summary">
        <div><span>Progresso geral</span><strong>{project.progress}%</strong><i><b style={{ width: `${project.progress}%` }} /></i></div>
        <div><span>Próxima entrega</span><strong>{project.nextMilestone}</strong><small>{project.nextMilestoneDate}</small></div>
        <div><span>Responsável</span><strong>{project.owner}</strong><small>Equipe ANUNSEE</small></div>
        <div><span>Previsão atual</span><strong>{project.due}</strong><small>Atualizada conforme o projeto</small></div>
      </section>

      <nav className="portal-project-tabs"><button className={active === 'escopo' ? 'active' : ''} onClick={() => setActive('escopo')}>Visão e escopo</button><button className={active === 'entregas' ? 'active' : ''} onClick={() => setActive('entregas')}>Entregas</button></nav>
      {active === 'escopo' ? (
        <div className="portal-scope-layout">
          <section className="portal-scope-story"><span className="portal-overline">Resultado esperado</span><h2>Construir uma operação mais previsível, com visibilidade sobre cada etapa.</h2><p>O projeto conecta estratégia, execução e acompanhamento. As decisões que dependem da sua equipe aparecem separadamente, enquanto o trabalho interno permanece organizado pela ANUNSEE.</p><div><span><Check size={14} /> Visibilidade sobre o andamento</span><span><Check size={14} /> Aprovações com histórico</span><span><Check size={14} /> Arquivos no contexto correto</span></div></section>
          <aside className="portal-included"><span className="portal-overline">O que está incluído</span>{['Diagnóstico e planejamento', 'Estrutura de aquisição', 'Produção das entregas', 'Validação conjunta', 'Acompanhamento inicial'].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 2 ? <BadgeCheck size={16} /> : <Circle size={15} />}</div>)}</aside>
        </div>
      ) : (
        <section className="portal-deliverable-list">
          {[['Plano de campanha', 'Pronto para aprovação', 'PDF · versão 2'], ['Mapa da jornada', 'Concluído', 'PDF · versão final'], ['Configuração da campanha', 'Em produção', 'Entrega operacional'], ['Relatório inicial', 'Planejado', 'Após publicação']].map(([title, status, meta], index) => <article key={title}><span className={`portal-deliverable-index portal-deliverable-index--${index < 2 ? 'done' : 'next'}`}>{index < 2 ? <Check size={15} /> : index + 1}</span><span><strong>{title}</strong><small>{meta}</small></span><span className={`portal-deliverable-status portal-deliverable-status--${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span><ChevronRight size={15} /></article>)}
        </section>
      )}
    </div>
  )
}

export function ClientPortalApprovalsPage() {
  const { clientId } = useParams()
  const { client } = getPortalContext(clientId)
  const [approvals, setApprovals] = useState(() => approvalSeed.filter((item) => item.clientId === client.id))
  const [selectedId, setSelectedId] = useState(approvals[0]?.id)
  const [feedback, setFeedback] = useState('')
  const selected = approvals.find((item) => item.id === selectedId) ?? approvals[0]

  const decide = (status: ApprovalItem['status']) => {
    if (!selected) return
    setApprovals((current) => current.map((item) => item.id === selected.id ? { ...item, status } : item))
    setFeedback('')
  }

  return (
    <div className="portal-page portal-approvals-page">
      <PortalHeading overline="Decisões compartilhadas" title="Aprovações" description="Revise entregas em contexto. Toda decisão fica registrada no projeto." />
      {selected ? (
        <section className="portal-approval-layout">
          <aside className="portal-approval-list">{approvals.map((item) => <button className={selected.id === item.id ? 'active' : ''} key={item.id} onClick={() => setSelectedId(item.id)}><span className={`portal-approval-state portal-approval-state--${item.status === 'Aprovado' ? 'done' : item.status === 'Alterações solicitadas' ? 'changes' : 'waiting'}`}>{item.status === 'Aprovado' ? <Check size={14} /> : <FileCheck2 size={15} />}</span><span><strong>{item.title}</strong><small>{item.type} · {item.version}</small></span><ChevronRight size={14} /></button>)}</aside>
          <article className="portal-approval-detail">
            <header><div><span>{selected.type} · {selected.version}</span><h2>{selected.title}</h2><p>{selected.description}</p></div><span className={`portal-status-pill portal-status-pill--${selected.status === 'Aprovado' ? 'done' : 'waiting'}`}>{selected.status}</span></header>
            <div className="portal-approval-preview"><div><span>ANUNSEE</span><small>ENTREGA PARA REVISÃO</small><h3>{selected.previewLabel}</h3><p>{selected.description}</p><i /><i /><footer><span>{client.name}</span><strong>{selected.version}</strong></footer></div></div>
            {selected.status === 'Aguardando' ? <><label className="portal-feedback"><span>Comentário ou contexto para a equipe</span><textarea rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Escreva aqui o que precisa ser considerado..." /></label><footer><button className="portal-secondary-button" onClick={() => decide('Alterações solicitadas')}>Solicitar ajustes</button><button className="portal-primary-button" onClick={() => decide('Aprovado')}><Check size={15} /> Aprovar entrega</button></footer></> : <div className="portal-decision-confirmed"><CheckCircle2 size={18} /><span><strong>Decisão registrada</strong><small>A equipe da ANUNSEE será notificada desta atualização.</small></span></div>}
          </article>
        </section>
      ) : <section className="portal-empty"><BadgeCheck size={26} /><h2>Nenhuma aprovação disponível</h2><p>Quando uma entrega precisar da sua decisão, ela aparecerá aqui.</p></section>}
    </div>
  )
}

export function ClientPortalFilesPage() {
  const [query, setQuery] = useState('')
  const filtered = portalFiles.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="portal-page portal-files-page">
      <PortalHeading overline="Biblioteca compartilhada" title="Arquivos" description="Materiais organizados pelo projeto e pela etapa em que foram entregues." action={<button className="portal-secondary-button"><Upload size={15} /> Enviar arquivo</button>} />
      <section className="portal-files-toolbar"><div><FolderOpen size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar arquivo" /></div><span>{filtered.length} arquivos visíveis</span></section>
      <section className="portal-file-grid">{filtered.map((file) => <button key={file.id}><span className={`portal-file-icon portal-file-icon--${file.type.toLowerCase()}`}><FileText size={21} /></span><span><strong>{file.name}</strong><small>{file.type} · {file.size}</small><time>Atualizado {file.updated.toLowerCase()}</time></span><Download size={16} /></button>)}</section>
    </div>
  )
}

const initialMessages = [
  { id: 'message-1', author: 'Iago', role: 'ANUNSEE', text: 'Olá! A nova versão do plano de campanha já está disponível para sua revisão.', time: '09:42', mine: false },
  { id: 'message-2', author: 'Lucy', role: 'Cliente', text: 'Perfeito. Vou revisar ainda hoje e deixo os comentários na aprovação.', time: '10:08', mine: true },
]

export function ClientPortalMessagesPage() {
  const { clientId } = useParams()
  const { project } = getPortalContext(clientId)
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')
  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    if (!text.trim()) return
    setMessages((current) => [...current, { id: `message-${Date.now()}`, author: 'Você', role: 'Cliente', text: text.trim(), time: 'Agora', mine: true }])
    setText('')
  }
  return (
    <div className="portal-page portal-messages-page">
      <PortalHeading overline="Canal do projeto" title="Mensagens" description="Converse com a equipe sem perder o contexto das decisões e entregas." />
      <section className="portal-conversation">
        <header><div><span className="portal-conversation__avatar">A</span><span><strong>Equipe ANUNSEE</strong><small><i /> Respondemos por aqui</small></span></div><span>Projeto: {project.name}</span></header>
        <div className="portal-message-thread"><time>Hoje</time>{messages.map((message) => <article className={message.mine ? 'portal-message portal-message--mine' : 'portal-message'} key={message.id}><header><strong>{message.author}</strong><span>{message.role}</span></header><p>{message.text}</p><time>{message.time}</time></article>)}</div>
        <form className="portal-message-composer" onSubmit={sendMessage}><button type="button"><Paperclip size={17} /></button><textarea rows={2} value={text} onChange={(event) => setText(event.target.value)} placeholder="Escreva uma mensagem para a equipe..." /><button className="portal-primary-button" type="submit" disabled={!text.trim()}><Send size={15} /> Enviar</button></form>
      </section>
    </div>
  )
}
