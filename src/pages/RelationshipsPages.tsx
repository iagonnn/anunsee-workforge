import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Building2, CalendarClock, Check, ChevronDown, CircleDollarSign,
  Clock3, FileCheck2, FilePenLine, Filter, GitBranch, Globe2, Mail, MessageSquareText,
  MoreHorizontal, Phone, Plus, Search, Send, Sparkles, UserRound, UsersRound,
} from 'lucide-react'
import { Badge, Button, Card, Drawer, Modal, PageHeader } from '../components/ui'
import { useApp } from '../context/AppContext'
import { readStorage, writeStorage } from '../services/storage'

type Opportunity = {
  id: string
  company: string
  contact: string
  value: string
  owner: string
  stage: 'Novo lead' | 'Contato' | 'Qualificado' | 'Proposta' | 'Negociação'
  next: string
  score: number
  age: string
  source: string
}

const opportunities: Opportunity[] = [
  { id: 'opp-novavia', company: 'NovaVia Consórcios', contact: 'Ricardo Alves', value: 'R$ 18.400', owner: 'Rafael Martins', stage: 'Novo lead', next: 'Revisar diagnóstico comercial', score: 86, age: '1 dia', source: 'Instagram' },
  { id: 'opp-casaclara', company: 'Casa Clara Serviços', contact: 'Paulo Nogueira', value: 'R$ 9.800', owner: 'Camila Rocha', stage: 'Contato', next: 'Ligar hoje às 14:00', score: 72, age: '3 dias', source: 'Indicação' },
  { id: 'opp-horizonte', company: 'Horizonte Arquitetura', contact: 'Mariana Costa', value: 'R$ 24.400', owner: 'Rafael Martins', stage: 'Qualificado', next: 'Preparar escopo', score: 91, age: '5 dias', source: 'Site' },
  { id: 'opp-aurora', company: 'Clínica Aurora', contact: 'Fernanda Lima', value: 'R$ 12.900', owner: 'Bruno Tavares', stage: 'Proposta', next: 'Follow-up amanhã', score: 78, age: '8 dias', source: 'Google' },
  { id: 'opp-pixel', company: 'Pixel Norte Agência', contact: 'Lucas Martins', value: 'R$ 16.900', owner: 'Rafael Martins', stage: 'Negociação', next: 'Aprovar condição comercial', score: 88, age: '12 dias', source: 'Evento' },
]

const stages: Opportunity['stage'][] = ['Novo lead', 'Contato', 'Qualificado', 'Proposta', 'Negociação']

function toneForStage(stage: Opportunity['stage']): 'neutral' | 'blue' | 'green' | 'purple' | 'orange' {
  if (stage === 'Novo lead') return 'neutral'
  if (stage === 'Contato') return 'blue'
  if (stage === 'Qualificado') return 'green'
  if (stage === 'Proposta') return 'purple'
  return 'orange'
}

export function PipelinePage() {
  const { notify } = useApp()
  const [items, setItemsState] = useState<Opportunity[]>(() => readStorage('wf-opportunities-v1', opportunities))
  const setItems = (updater: Opportunity[] | ((current: Opportunity[]) => Opportunity[])) => setItemsState((current) => { const next = typeof updater === 'function' ? (updater as (value: Opportunity[]) => Opportunity[])(current) : updater; writeStorage('wf-opportunities-v1', next); return next })
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'board' | 'list'>('board')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newCompany, setNewCompany] = useState('')
  const [newContact, setNewContact] = useState('')
  const filtered = items.filter((item) => `${item.company} ${item.contact}`.toLowerCase().includes(query.toLowerCase()))
  const move = (stage: Opportunity['stage']) => {
    if (!draggedId) return
    setItems((current) => current.map((item) => item.id === draggedId ? { ...item, stage } : item))
    setDraggedId(null)
    notify(`Oportunidade movida para ${stage}.`, 'success')
  }

  return (
    <div className="page page--wide pipeline-page">
      <PageHeader eyebrow="Relacionamentos" title="Pipeline" description="Gerencie oportunidades por etapa, valor, próxima ação e tempo parado." actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Novo lead</Button>} />
      <div className="pipeline-summary">
        <Card><span>Valor aberto</span><strong>R$ 82,4k</strong><small>18 oportunidades</small></Card>
        <Card><span>Previsão ponderada</span><strong>R$ 46,1k</strong><small>Probabilidade por etapa</small></Card>
        <Card><span>Sem próxima ação</span><strong>3</strong><small>Precisam de atenção</small></Card>
        <Card><span>Conversão</span><strong>31%</strong><small>Últimos 90 dias</small></Card>
      </div>
      <div className="toolbar pipeline-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empresa ou contato..." /></div><Button><Filter size={15} /> Filtros</Button><div className="segmented-control"><button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}>Quadro</button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Lista</button></div></div>
      {view === 'board' ? (
        <div className="pipeline-board">
          {stages.map((stage) => {
            const stageItems = filtered.filter((item) => item.stage === stage)
            return (
              <section className="pipeline-column" key={stage} onDragOver={(event) => event.preventDefault()} onDrop={() => move(stage)}>
                <header><span><i className={`stage-dot stage-dot--${toneForStage(stage)}`} />{stage}</span><Badge>{stageItems.length}</Badge><button aria-label={`Adicionar em ${stage}`} onClick={() => setCreateOpen(true)}><Plus size={14} /></button></header>
                <div className="pipeline-column__value">{stageItems.length ? stageItems.map((item) => Number(item.value.replace(/\D/g, ''))).reduce((sum, value) => sum + value, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : 'US$ 0'}</div>
                <div className="pipeline-card-list">{stageItems.map((item) => <button className="opportunity-card" draggable onDragStart={() => setDraggedId(item.id)} onClick={() => setSelected(item)} key={item.id}><div className="opportunity-card__top"><Badge tone={item.score >= 85 ? 'green' : 'blue'}>Score {item.score}</Badge><MoreHorizontal size={15} /></div><strong>{item.company}</strong><small>{item.contact} · {item.source}</small><div className="opportunity-card__value">{item.value}</div><div className="opportunity-card__next"><Clock3 size={13} /><span>{item.next}</span></div><footer><span className="mini-avatar">{item.owner.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span>{item.age} na etapa</span></footer></button>)}</div>
                <button className="pipeline-add" onClick={() => setCreateOpen(true)}><Plus size={14} /> Adicionar oportunidade</button>
              </section>
            )
          })}
        </div>
      ) : (
        <Card className="table-card"><div className="data-table pipeline-table"><div className="data-table__head"><span>Empresa</span><span>Etapa</span><span>Valor</span><span>Score</span><span>Próxima ação</span><span>Responsável</span><span /></div>{filtered.map((item) => <button className="data-table__row" key={item.id} onClick={() => setSelected(item)}><span><strong>{item.company}</strong><small>{item.contact}</small></span><span><Badge tone={toneForStage(item.stage)}>{item.stage}</Badge></span><span>{item.value}</span><span>{item.score}</span><span>{item.next}</span><span>{item.owner}</span><span><ArrowRight size={14} /></span></button>)}</div></Card>
      )}
      {createOpen ? <Modal title="Novo lead" description="Cadastre o contato inicial; ele entra na primeira etapa do Pipeline." onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Empresa</span><input autoFocus value={newCompany} onChange={(event) => setNewCompany(event.target.value)} placeholder="Ex.: NovaVia Consórcios" /></label><label className="field field--full"><span>Contato</span><input value={newContact} onChange={(event) => setNewContact(event.target.value)} placeholder="Nome do contato" /></label><div className="form-grid"><label className="field"><span>Valor estimado</span><input placeholder="R$ 0" /></label><label className="field"><span>Origem</span><select><option>Site</option><option>Indicação</option><option>Pesquisa automatizada</option><option>Evento</option></select></label></div><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!newCompany.trim()} onClick={() => { const item: Opportunity = { id: `opp-${Date.now()}`, company: newCompany.trim(), contact: newContact.trim() || 'Contato não informado', value: 'R$ 0', owner: 'Rafael Martins', stage: 'Novo lead', next: 'Definir próxima ação', score: 50, age: 'agora', source: 'Cadastro manual' }; setItems((current) => [item, ...current]); setNewCompany(''); setNewContact(''); setCreateOpen(false); setSelected(item); notify('Lead adicionado ao Pipeline.', 'success') }}>Adicionar lead</Button></div></div></Modal> : null}
      {selected ? <Drawer title={selected.company} description={`${selected.contact} · ${selected.source}`} onClose={() => setSelected(null)}><OpportunityDetail opportunity={selected} /></Drawer> : null}
    </div>
  )
}

function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const navigate = useNavigate()
  const { notify } = useApp()
  return <div className="entity-detail"><div className="entity-detail__hero"><span className="entity-logo"><Building2 size={22} /></span><div><Badge tone={toneForStage(opportunity.stage)}>{opportunity.stage}</Badge><h3>{opportunity.value}</h3><p>Score {opportunity.score} · {opportunity.age} nesta etapa</p></div></div><div className="detail-action-grid"><Button variant="primary" onClick={() => navigate('/relationships/proposals')}><FilePenLine size={15} /> Criar proposta</Button><Button onClick={() => notify('Atividade registrada.', 'success')}><CalendarClock size={15} /> Registrar atividade</Button></div><section className="detail-section"><h4>Próxima ação</h4><div className="next-action-card"><Clock3 size={16} /><span><strong>{opportunity.next}</strong><small>Responsável: {opportunity.owner}</small></span><button><Check size={15} /></button></div></section><section className="detail-section"><h4>Contato</h4><div className="property-list"><div><span><UserRound size={14} /> Pessoa</span><strong>{opportunity.contact}</strong></div><div><span><Mail size={14} /> Email</span><strong>contato@empresa.example</strong></div><div><span><Phone size={14} /> Telefone</span><strong>+1 (000) 000-0000</strong></div></div></section><section className="detail-section"><h4>Contexto da IA</h4><div className="ai-context-card"><Sparkles size={17} /><p>A empresa apresenta bom encaixe com serviços recorrentes e possui sinais de expansão. Recomenda-se uma proposta com onboarding curto.</p></div></section></div>
}

type Client = { id: string; name: string; industry: string; location: string; health: string; owner: string; projects: number; value: string; last: string; portal: string; initials: string }
const clients: Client[] = [
  { id: 'client-northstar', name: 'Horizonte Arquitetura', industry: 'Flooring installation', location: 'Charleston, SC', health: 'Saudável', owner: 'Rafael Martins', projects: 2, value: 'US$ 38.400', last: 'Hoje, 09:42', portal: 'Publicado', initials: 'NF' },
  { id: 'client-bright', name: 'Clínica Aurora', industry: 'Commercial cleaning', location: 'Boston, MA', health: 'Atenção', owner: 'Camila Rocha', projects: 1, value: 'US$ 18.200', last: 'Há 4 dias', portal: 'Rascunho', initials: 'BC' },
  { id: 'client-atlas', name: 'Atlas Renovations', industry: 'Home improvement', location: 'Miami, FL', health: 'Saudável', owner: 'Bruno Tavares', projects: 3, value: 'US$ 52.900', last: 'Ontem, 16:10', portal: 'Publicado', initials: 'AR' },
  { id: 'client-lumen', name: 'Lumen Studios', industry: 'Creative services', location: 'Lisboa, PT', health: 'Em risco', owner: 'Larissa Mendes', projects: 1, value: '€ 12.600', last: 'Há 7 dias', portal: 'Não criado', initials: 'LS' },
]

export function ClientsPage() {
  const navigate = useNavigate()
  const { notify } = useApp()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(clients)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const filtered = items.filter((client) => `${client.name} ${client.industry}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page clients-page"><PageHeader eyebrow="Relacionamentos" title="Clientes" description="Uma central por conta, com projetos, propostas, reuniões, arquivos e portal." actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Novo cliente</Button>} /><div className="client-overview-strip"><div><strong>24</strong><span>Clientes ativos</span></div><div><strong>US$ 121k</strong><span>Valor contratado</span></div><div><strong>4</strong><span>Em onboarding</span></div><div><strong>2</strong><span>Precisam de atenção</span></div></div><div className="toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar clientes..." /></div><Button><Filter size={15} /> Filtros</Button><Button>Saúde <ChevronDown size={14} /></Button></div><div className="client-card-grid">{filtered.map((client) => <button className="client-account-card" key={client.id} onClick={() => navigate(`/relationships/clients/${client.id}`)}><div className="client-account-card__header"><span className="client-logo">{client.initials}</span><span><Badge tone={client.health === 'Saudável' ? 'green' : client.health === 'Atenção' ? 'orange' : 'red'}>{client.health}</Badge><MoreHorizontal size={16} /></span></div><h3>{client.name}</h3><p>{client.industry} · {client.location}</p><div className="client-account-card__metrics"><div><strong>{client.projects}</strong><small>projetos ativos</small></div><div><strong>{client.value}</strong><small>contratado</small></div></div><div className="client-account-card__footer"><span><span className="mini-avatar">{client.owner.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>{client.owner}</span><span>{client.last}</span></div></button>)}</div>{createOpen ? <Modal title="Novo cliente" description="Crie a conta principal e conecte projetos, propostas e portal depois." onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Nome da empresa</span><input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nome do cliente" /></label><div className="form-grid"><label className="field"><span>Segmento</span><input placeholder="Ex.: Serviços" /></label><label className="field"><span>Localização</span><input placeholder="Cidade, região" /></label></div><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!newName.trim()} onClick={() => { const client: Client = { id: `client-${Date.now()}`, name: newName.trim(), industry: 'Segmento não informado', location: 'Localização não informada', health: 'Saudável', owner: 'Rafael Martins', projects: 0, value: 'R$ 0', last: 'Agora', portal: 'Não criado', initials: newName.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() }; setItems((current) => [client, ...current]); setNewName(''); setCreateOpen(false); notify('Cliente criado localmente.', 'success') }}>Criar cliente</Button></div></div></Modal> : null}</div>
}

export function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const client = clients.find((item) => item.id === clientId) ?? clients[0]
  const [tab, setTab] = useState('Visão geral')
  const tabs = ['Visão geral', 'Projetos', 'Propostas', 'Tarefas', 'Reuniões', 'Arquivos', 'Aprovações', 'Portal', 'Histórico']
  return <div className="page entity-page"><button className="page-back-link" onClick={() => navigate('/relationships/clients')}><ArrowLeft size={15} /> Clientes</button><header className="entity-page__header"><span className="client-logo client-logo--lg">{client.initials}</span><div><div className="entity-page__title-row"><h1>{client.name}</h1><Badge tone={client.health === 'Saudável' ? 'green' : 'orange'}>{client.health}</Badge></div><p>{client.industry} · {client.location}</p></div><div className="entity-page__actions"><Button><MessageSquareText size={15} /> Mensagem</Button><Button variant="primary" onClick={() => setTab('Portal')}><Globe2 size={15} /> Abrir portal</Button></div></header><nav className="entity-tabs">{tabs.map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</nav>{tab === 'Visão geral' ? <ClientOverview client={client} onOpen={(next) => setTab(next)} /> : <ClientTab tab={tab} client={client} />}</div>
}

function ClientOverview({ client, onOpen }: { client: Client; onOpen: (tab: string) => void }) {
  return <div className="entity-overview-grid"><div className="entity-overview-main"><Card><div className="card-heading-row"><div><h2>Resumo da conta</h2><p>Contexto comercial e operacional.</p></div><Button>Editar</Button></div><div className="account-property-grid"><div><span>Responsável</span><strong>{client.owner}</strong></div><div><span>Valor contratado</span><strong>{client.value}</strong></div><div><span>Última interação</span><strong>{client.last}</strong></div><div><span>Portal</span><strong>{client.portal}</strong></div></div></Card><Card><div className="card-heading-row"><div><h2>Projetos ativos</h2><p>Entregas conectadas a esta conta.</p></div><button className="text-button" onClick={() => onOpen('Projetos')}>Ver todos</button></div><div className="account-project-list"><button><span><strong>Portal do cliente</strong><small>Entrega em 18 jul · 82%</small></span><Badge tone="green">Saudável</Badge></button><button><span><strong>Automação de onboarding</strong><small>Entrega em 29 jul · 48%</small></span><Badge tone="orange">Atenção</Badge></button></div></Card><Card><div className="card-heading-row"><div><h2>Atividade recente</h2><p>Interações e alterações da conta.</p></div></div><div className="activity-timeline"><div><i /><span><strong>Proposta visualizada</strong><small>Hoje, 09:42 · Portal do cliente</small></span></div><div><i /><span><strong>Arquivo aprovado</strong><small>Ontem, 16:20 · Design final</small></span></div><div><i /><span><strong>Reunião concluída</strong><small>12 jul, 14:30 · Kickoff</small></span></div></div></Card></div><aside className="entity-overview-side"><Card><h2>Contato principal</h2><div className="contact-profile"><AvatarLike name="Maria Thompson" /><div><strong>Maria Thompson</strong><small>Operations Manager</small></div></div><div className="property-list"><div><span><Mail size={14} /> Email</span><strong>maria@company.example</strong></div><div><span><Phone size={14} /> Telefone</span><strong>+1 (000) 000-0000</strong></div></div></Card><Card><h2>Próxima ação</h2><div className="next-action-card"><CalendarClock size={16} /><span><strong>Reunião de aprovação</strong><small>Amanhã, 14:30</small></span></div><Button variant="primary">Abrir agenda</Button></Card></aside></div>
}

function AvatarLike({ name }: { name: string }) { return <span className="contact-avatar">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span> }

function ClientTab({ tab, client }: { tab: string; client: Client }) {
  return <Card className="client-tab-panel"><div className="card-heading-row"><div><h2>{tab}</h2><p>Dados relacionados a {client.name}.</p></div><Button variant="primary"><Plus size={15} /> Adicionar</Button></div><div className="tab-empty-structured"><Building2 size={24} /><h3>{tab} do cliente</h3><p>Esta área já está separada para receber os registros relacionados sem misturar o contexto da conta.</p></div></Card>
}

type Proposal = { id: string; title: string; client: string; value: string; status: 'Rascunho' | 'Enviada' | 'Visualizada' | 'Aguardando' | 'Aprovada' | 'Rejeitada'; sent: string; expires: string; owner: string; viewed: string }
const proposals: Proposal[] = [
  { id: 'proposal-northstar', title: 'Portal do cliente', client: 'Horizonte Arquitetura', value: 'US$ 8.500', status: 'Visualizada', sent: '14 jul', expires: '21 jul', owner: 'Rafael Martins', viewed: 'Hoje, 09:42' },
  { id: 'proposal-bright', title: 'Site institucional', client: 'Clínica Aurora', value: 'US$ 5.200', status: 'Aguardando', sent: '12 jul', expires: '16 jul', owner: 'Camila Rocha', viewed: 'Ainda não visualizada' },
  { id: 'proposal-atlas', title: 'Automação comercial', client: 'Atlas Renovations', value: 'US$ 11.900', status: 'Aprovada', sent: '8 jul', expires: '15 jul', owner: 'Rafael Martins', viewed: '10 jul, 13:20' },
  { id: 'proposal-lumen', title: 'Brand refresh', client: 'Lumen Studios', value: '€ 6.800', status: 'Rascunho', sent: '—', expires: '—', owner: 'Larissa Mendes', viewed: '—' },
]
const proposalStatuses: Proposal['status'][] = ['Rascunho', 'Enviada', 'Visualizada', 'Aguardando', 'Aprovada', 'Rejeitada']
function proposalTone(status: Proposal['status']): 'neutral' | 'blue' | 'purple' | 'orange' | 'green' | 'red' { return status === 'Rascunho' ? 'neutral' : status === 'Enviada' ? 'blue' : status === 'Visualizada' ? 'purple' : status === 'Aguardando' ? 'orange' : status === 'Aprovada' ? 'green' : 'red' }

export function ProposalsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState<'Todas' | Proposal['status']>('Todas')
  const filtered = active === 'Todas' ? proposals : proposals.filter((item) => item.status === active)
  return <div className="page proposals-page"><PageHeader eyebrow="Relacionamentos" title="Propostas" description="Crie documentos comerciais, acompanhe visualizações e transforme aprovações em projetos." actions={<Button variant="primary" onClick={() => navigate('/relationships/proposals/new')}><Plus size={16} /> Nova proposta</Button>} /><div className="proposal-metrics"><Card><span>Em preparação</span><strong>4</strong><small>US$ 21,4k</small></Card><Card><span>Aguardando resposta</span><strong>8</strong><small>3 vencem esta semana</small></Card><Card><span>Aprovadas</span><strong>12</strong><small>Últimos 90 dias</small></Card><Card><span>Tempo médio</span><strong>4,2 dias</strong><small>Até a resposta</small></Card></div><div className="proposal-status-tabs"><button className={active === 'Todas' ? 'active' : ''} onClick={() => setActive('Todas')}>Todas <span>{proposals.length}</span></button>{proposalStatuses.map((status) => <button className={active === status ? 'active' : ''} onClick={() => setActive(status)} key={status}>{status} <span>{proposals.filter((item) => item.status === status).length}</span></button>)}</div><Card className="proposal-list-card"><div className="proposal-list-header"><span>Proposta</span><span>Valor</span><span>Status</span><span>Enviada</span><span>Expira</span><span>Responsável</span><span /></div>{filtered.map((proposal) => <button className="proposal-list-row" key={proposal.id} onClick={() => navigate(`/relationships/proposals/${proposal.id}`)}><span className="proposal-list-row__title"><i><FileCheck2 size={17} /></i><span><strong>{proposal.title}</strong><small>{proposal.client}</small></span></span><span>{proposal.value}</span><span><Badge tone={proposalTone(proposal.status)}>{proposal.status}</Badge></span><span>{proposal.sent}</span><span>{proposal.expires}</span><span>{proposal.owner}</span><ArrowRight size={15} /></button>)}</Card></div>
}

export function ProposalDetailPage() {
  const { proposalId } = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()
  const proposal = proposalId === 'new' ? { id: 'new', title: 'Nova proposta', client: 'Selecione um cliente', value: 'R$ 0', status: 'Rascunho' as const, sent: '—', expires: '—', owner: 'Rafael Martins', viewed: 'Ainda não compartilhada' } : proposals.find((item) => item.id === proposalId) ?? proposals[0]
  const [status, setStatus] = useState(proposal.status)
  const [scope, setScope] = useState('Planejamento, design e desenvolvimento de um portal seguro para acompanhamento de projetos, arquivos e aprovações.')
  return <div className="page proposal-editor-page"><div className="proposal-editor-top"><button className="page-back-link" onClick={() => navigate('/relationships/proposals')}><ArrowLeft size={15} /> Propostas</button><div><Button>Pré-visualizar</Button><Button onClick={() => notify('Link de visualização copiado.', 'success')}>Compartilhar</Button><Button variant="primary" onClick={() => { setStatus('Enviada'); notify('Proposta enviada na simulação.', 'success') }}><Send size={15} /> Enviar proposta</Button></div></div><div className="proposal-editor-layout"><aside className="proposal-outline"><span className="eyebrow">Estrutura</span>{['Capa', 'Resumo', 'Escopo', 'Cronograma', 'Investimento', 'Condições', 'Aprovação'].map((item, index) => <button className={index === 2 ? 'active' : ''} key={item}><span>{index + 1}</span>{item}</button>)}</aside><main className="proposal-document"><header><span className="document-kicker">Proposta comercial</span><h1>{proposal.title}</h1><p>Preparada para {proposal.client}</p><div><Badge tone={proposalTone(status)}>{status}</Badge><span>{proposal.value}</span><span>Válida até {proposal.expires}</span></div></header><section><span className="document-section-number">03</span><h2>Escopo do trabalho</h2><textarea value={scope} onChange={(event) => setScope(event.target.value)} rows={5} /><div className="scope-deliverables"><div><Check size={15} /><span><strong>Descoberta e planejamento</strong><small>Mapeamento do fluxo, usuários e permissões.</small></span></div><div><Check size={15} /><span><strong>Design da experiência</strong><small>Interface responsiva, componentes e protótipo.</small></span></div><div><Check size={15} /><span><strong>Implementação</strong><small>Frontend integrado e preparado para o backend.</small></span></div></div></section><section className="investment-block"><div><span>Investimento total</span><strong>{proposal.value}</strong><small>50% no início · 50% na entrega</small></div><Button variant="primary" onClick={() => { setStatus('Aprovada'); notify('Proposta aprovada e pronta para virar projeto.', 'success') }}>Aprovar proposta</Button></section></main><aside className="proposal-inspector"><Card><span className="eyebrow">Acompanhamento</span><h2>{proposal.viewed}</h2><p>Última visualização do cliente.</p></Card><Card><h2>Detalhes</h2><div className="property-list"><div><span>Status</span><strong>{status}</strong></div><div><span>Responsável</span><strong>{proposal.owner}</strong></div><div><span>Valor</span><strong>{proposal.value}</strong></div><div><span>Expiração</span><strong>{proposal.expires}</strong></div></div></Card><Card><h2>Próxima ação</h2><p>Transforme a proposta aprovada em projeto com tarefas iniciais.</p><Button onClick={() => navigate('/execution/projects?create=1')}>Criar projeto <ArrowRight size={15} /></Button></Card></aside></div></div>
}

export function PortalsPage() {
  const navigate = useNavigate()
  const { notify } = useApp()
  const [createOpen, setCreateOpen] = useState(false)
  return <div className="page"><PageHeader eyebrow="Relacionamentos" title="Portais do cliente" description="Espaços externos para progresso, arquivos, mensagens e aprovações." actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Novo portal</Button>} /><div className="portal-card-grid">{clients.slice(0, 3).map((client) => <Card className="portal-preview-card" key={client.id}><div className="portal-preview-card__visual"><span className="client-logo">{client.initials}</span><div><strong>{client.name}</strong><small>Portal do cliente</small></div></div><div className="portal-preview-card__stats"><span><strong>{client.projects}</strong><small>projetos</small></span><span><strong>6</strong><small>arquivos</small></span><span><strong>2</strong><small>aprovações</small></span></div><footer><Badge tone={client.portal === 'Publicado' ? 'green' : 'orange'}>{client.portal}</Badge><Button onClick={() => navigate(`/relationships/clients/${client.id}`)}>Abrir</Button></footer></Card>)}</div>{createOpen ? <Modal title="Criar portal do cliente" description="Escolha a conta e os módulos que ficarão visíveis externamente." onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Cliente</span><select autoFocus>{clients.map((client) => <option key={client.id}>{client.name}</option>)}</select></label><label className="field field--full"><span>Nome do portal</span><input placeholder="Portal do cliente" /></label><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => { setCreateOpen(false); notify('Portal criado como rascunho.', 'success') }}>Criar rascunho</Button></div></div></Modal> : null}</div>
}
