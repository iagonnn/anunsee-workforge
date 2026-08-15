import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive, ArrowRight, Building2, CalendarPlus, Check, Circle, Filter, Mail,
  MessageSquareMore, MoreHorizontal, Phone, Plus, Search, Send, Tag, UserPlus,
  UsersRound,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, Drawer, EmptyState, Modal, PageHeader } from '../components/ui'
import { readStorage, writeStorage } from '../services/storage'
import { useApp } from '../context/AppContext'

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'Lead' | 'Cliente' | 'Parceiro'
  owner: string
  source: string
  lastInteraction: string
  tags: string[]
  archived?: boolean
}

type Company = {
  id: string
  name: string
  industry: string
  city: string
  website: string
  owner: string
  contacts: number
  opportunities: number
  value: string
  lastInteraction: string
}

type Message = { id: string; sender: 'contact' | 'user'; body: string; time: string }
type Conversation = {
  id: string
  contactId: string
  contact: string
  company: string
  channel: 'WhatsApp' | 'Email' | 'Instagram'
  unread: boolean
  assignedTo: string
  tags: string[]
  updatedAt: string
  messages: Message[]
}

const initialContacts: Contact[] = [
  { id: 'contact-1', name: 'Mariana Costa', email: 'mariana@horizonte.demo', phone: '(11) 90000-0101', company: 'Horizonte Arquitetura', status: 'Cliente', owner: 'Rafael Martins', source: 'Indicação', lastInteraction: 'Hoje, 10:42', tags: ['Arquitetura', 'VIP'] },
  { id: 'contact-2', name: 'Ricardo Alves', email: 'ricardo@novavia.demo', phone: '(11) 90000-0202', company: 'NovaVia Consórcios', status: 'Lead', owner: 'Camila Rocha', source: 'Instagram', lastInteraction: 'Hoje, 09:15', tags: ['Consórcio'] },
  { id: 'contact-3', name: 'Fernanda Lima', email: 'fernanda@aurora.demo', phone: '(21) 90000-0303', company: 'Clínica Aurora', status: 'Cliente', owner: 'Rafael Martins', source: 'Google', lastInteraction: 'Ontem, 16:20', tags: ['Saúde'] },
  { id: 'contact-4', name: 'Paulo Nogueira', email: 'paulo@casaclara.demo', phone: '(31) 90000-0404', company: 'Casa Clara Serviços', status: 'Parceiro', owner: 'Larissa Mendes', source: 'Evento', lastInteraction: '12 jul, 14:30', tags: ['Serviços'] },
]

const initialCompanies: Company[] = [
  { id: 'company-1', name: 'Horizonte Arquitetura', industry: 'Arquitetura e engenharia', city: 'São Paulo/SP', website: 'horizonte.demo', owner: 'Rafael Martins', contacts: 4, opportunities: 2, value: 'R$ 48.000', lastInteraction: 'Hoje, 10:42' },
  { id: 'company-2', name: 'NovaVia Consórcios', industry: 'Vendas e representação', city: 'Campinas/SP', website: 'novavia.demo', owner: 'Camila Rocha', contacts: 7, opportunities: 5, value: 'R$ 86.500', lastInteraction: 'Hoje, 09:15' },
  { id: 'company-3', name: 'Clínica Aurora', industry: 'Saúde e estética', city: 'Rio de Janeiro/RJ', website: 'aurora.demo', owner: 'Rafael Martins', contacts: 3, opportunities: 1, value: 'R$ 18.900', lastInteraction: 'Ontem, 16:20' },
  { id: 'company-4', name: 'Casa Clara Serviços', industry: 'Serviços residenciais', city: 'Belo Horizonte/MG', website: 'casaclara.demo', owner: 'Larissa Mendes', contacts: 5, opportunities: 3, value: 'R$ 31.200', lastInteraction: '12 jul, 14:30' },
]

const initialConversations: Conversation[] = [
  { id: 'conversation-1', contactId: 'contact-2', contact: 'Ricardo Alves', company: 'NovaVia Consórcios', channel: 'WhatsApp', unread: true, assignedTo: 'Camila Rocha', tags: ['Lead quente'], updatedAt: '10:42', messages: [
    { id: 'm1', sender: 'contact', body: 'Olá! Vi a apresentação e queria entender melhor como funciona a implantação.', time: '10:35' },
    { id: 'm2', sender: 'user', body: 'Olá, Ricardo. Posso te mostrar o fluxo e entender como sua equipe trabalha hoje.', time: '10:38' },
    { id: 'm3', sender: 'contact', body: 'Perfeito. Tenho disponibilidade amanhã pela manhã.', time: '10:42' },
  ] },
  { id: 'conversation-2', contactId: 'contact-1', contact: 'Mariana Costa', company: 'Horizonte Arquitetura', channel: 'Email', unread: false, assignedTo: 'Rafael Martins', tags: ['Cliente'], updatedAt: '09:20', messages: [
    { id: 'm4', sender: 'contact', body: 'Enviei os arquivos revisados do projeto. Você consegue confirmar o recebimento?', time: '09:14' },
    { id: 'm5', sender: 'user', body: 'Recebido. Já vinculei os arquivos ao projeto e criei a próxima tarefa.', time: '09:20' },
  ] },
  { id: 'conversation-3', contactId: 'contact-3', contact: 'Fernanda Lima', company: 'Clínica Aurora', channel: 'Instagram', unread: true, assignedTo: 'Larissa Mendes', tags: ['Campanha'], updatedAt: 'Ontem', messages: [
    { id: 'm6', sender: 'contact', body: 'Podemos revisar a campanha antes de publicar?', time: 'Ontem, 16:04' },
  ] },
]

function useStoredList<T>(key: string, initial: T[]) {
  const [items, setItemsState] = useState<T[]>(() => readStorage(key, initial))
  const setItems = (updater: T[] | ((current: T[]) => T[])) => setItemsState((current) => {
    const next = typeof updater === 'function' ? (updater as (value: T[]) => T[])(current) : updater
    writeStorage(key, next)
    return next
  })
  return [items, setItems] as const
}

export function ContactsPage() {
  const { notify } = useApp()
  const [contacts, setContacts] = useStoredList<Contact>('wf-contacts-v1', initialContacts)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Todos')
  const [selected, setSelected] = useState<Contact | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })
  const visible = contacts.filter((contact) => !contact.archived && `${contact.name} ${contact.email} ${contact.company}`.toLowerCase().includes(query.toLowerCase()) && (status === 'Todos' || contact.status === status))

  const create = () => {
    if (!form.name.trim()) return
    const contact: Contact = { id: `contact-${Date.now()}`, name: form.name.trim(), email: form.email.trim() || 'Não informado', phone: form.phone.trim() || 'Não informado', company: form.company.trim() || 'Sem empresa', status: 'Lead', owner: 'Rafael Martins', source: 'Cadastro manual', lastInteraction: 'Agora', tags: [] }
    setContacts((current) => [contact, ...current])
    setForm({ name: '', email: '', phone: '', company: '' })
    setCreateOpen(false)
    setSelected(contact)
    notify('Contato criado com sucesso.', 'success')
  }

  const archive = (id: string) => {
    setContacts((current) => current.map((contact) => contact.id === id ? { ...contact, archived: true } : contact))
    setSelected(null)
    notify('Contato arquivado.', 'success')
  }

  return <div className="page page--wide crm-page">
    <PageHeader eyebrow="Relacionamento" title="Contatos" description="Pessoas, histórico, origem e próximos passos em um diretório único." actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><UserPlus size={16} /> Novo contato</Button>} />
    <div className="crm-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, email ou empresa..." /></div><div className="segmented-control">{['Todos', 'Lead', 'Cliente', 'Parceiro'].map((item) => <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div><Button><Filter size={15} /> Filtros</Button></div>
    <Card className="crm-table-card">{visible.length ? <div className="crm-table"><div className="crm-table__head"><span>Contato</span><span>Empresa</span><span>Status</span><span>Origem</span><span>Última interação</span><span>Responsável</span><span /></div>{visible.map((contact) => <button className="crm-table__row" key={contact.id} onClick={() => setSelected(contact)}><span className="crm-person"><Avatar name={contact.name} /><span><strong>{contact.name}</strong><small>{contact.email}</small></span></span><span>{contact.company}</span><span><Badge tone={contact.status === 'Cliente' ? 'green' : contact.status === 'Lead' ? 'blue' : 'purple'}>{contact.status}</Badge></span><span>{contact.source}</span><span>{contact.lastInteraction}</span><span>{contact.owner}</span><ArrowRight size={15} /></button>)}</div> : <EmptyState icon={<UsersRound />} title="Nenhum contato encontrado" description="Ajuste os filtros ou crie um novo contato." action={<Button onClick={() => setCreateOpen(true)}>Criar contato</Button>} />}</Card>
    {createOpen ? <Modal title="Novo contato" description="O contato será salvo localmente neste workspace." onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Nome</span><input autoFocus value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nome completo" /></label><div className="form-grid"><label className="field"><span>Email</span><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label><label className="field"><span>Telefone</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label></div><label className="field field--full"><span>Empresa</span><input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} /></label><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!form.name.trim()} onClick={create}>Criar contato</Button></div></div></Modal> : null}
    {selected ? <Drawer title={selected.name} description={`${selected.status} · ${selected.company}`} onClose={() => setSelected(null)}><div className="entity-detail"><div className="entity-detail__hero"><Avatar name={selected.name} size="lg" /><div><Badge tone={selected.status === 'Cliente' ? 'green' : 'blue'}>{selected.status}</Badge><h3>{selected.company}</h3><p>{selected.owner} · {selected.source}</p></div></div><div className="detail-action-grid"><Button variant="primary"><MessageSquareMore size={15} /> Conversar</Button><Button><CalendarPlus size={15} /> Agendar</Button></div><section className="detail-section"><h4>Informações</h4><div className="property-list"><div><span><Mail size={14} /> Email</span><strong>{selected.email}</strong></div><div><span><Phone size={14} /> Telefone</span><strong>{selected.phone}</strong></div><div><span><Tag size={14} /> Tags</span><strong>{selected.tags.join(', ') || 'Sem tags'}</strong></div></div></section><Button variant="danger" onClick={() => archive(selected.id)}><Archive size={15} /> Arquivar contato</Button></div></Drawer> : null}
  </div>
}

export function CompaniesPage() {
  const { notify } = useApp()
  const [companies, setCompanies] = useStoredList<Company>('wf-companies-v1', initialCompanies)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Company | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const visible = companies.filter((company) => `${company.name} ${company.industry} ${company.city}`.toLowerCase().includes(query.toLowerCase()))

  const create = () => {
    if (!name.trim()) return
    const company: Company = { id: `company-${Date.now()}`, name: name.trim(), industry: 'Não definido', city: 'Não informado', website: 'Não informado', owner: 'Rafael Martins', contacts: 0, opportunities: 0, value: 'R$ 0', lastInteraction: 'Agora' }
    setCompanies((current) => [company, ...current])
    setName('')
    setCreateOpen(false)
    setSelected(company)
    notify('Empresa criada com sucesso.', 'success')
  }

  return <div className="page page--wide companies-page"><PageHeader eyebrow="Relacionamento" title="Empresas" description="Organizações, contatos, oportunidades e atividade comercial." actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Nova empresa</Button>} />
    <div className="crm-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empresa, segmento ou cidade..." /></div><Button><Filter size={15} /> Filtros</Button></div>
    <div className="company-directory">{visible.map((company) => <button className="company-directory-card" key={company.id} onClick={() => setSelected(company)}><div className="company-directory-card__top"><span className="company-logo"><Building2 size={19} /></span><MoreHorizontal size={16} /></div><h3>{company.name}</h3><p>{company.industry}</p><div className="company-directory-card__stats"><span><strong>{company.contacts}</strong><small>contatos</small></span><span><strong>{company.opportunities}</strong><small>oportunidades</small></span><span><strong>{company.value}</strong><small>pipeline</small></span></div><footer><span>{company.city}</span><span>{company.lastInteraction}</span></footer></button>)}</div>
    {createOpen ? <Modal title="Nova empresa" description="Crie a organização e complete os detalhes depois." onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Nome da empresa</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Horizonte Arquitetura" /></label><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!name.trim()} onClick={create}>Criar empresa</Button></div></div></Modal> : null}
    {selected ? <Drawer title={selected.name} description={`${selected.industry} · ${selected.city}`} onClose={() => setSelected(null)} wide><div className="entity-detail"><div className="company-detail-metrics"><Card><span>Pipeline</span><strong>{selected.value}</strong><small>{selected.opportunities} oportunidades</small></Card><Card><span>Contatos</span><strong>{selected.contacts}</strong><small>Relacionados à empresa</small></Card><Card><span>Última interação</span><strong>{selected.lastInteraction}</strong><small>Responsável: {selected.owner}</small></Card></div><section className="detail-section"><h4>Visão geral</h4><div className="property-list"><div><span>Segmento</span><strong>{selected.industry}</strong></div><div><span>Localização</span><strong>{selected.city}</strong></div><div><span>Site</span><strong>{selected.website}</strong></div></div></section><div className="detail-action-grid"><Button variant="primary"><UserPlus size={15} /> Adicionar contato</Button><Button><Plus size={15} /> Nova oportunidade</Button></div></div></Drawer> : null}
  </div>
}

export function ConversationsPage() {
  const navigate = useNavigate()
  const { notify, openTaskComposer } = useApp()
  const [conversations, setConversations] = useStoredList<Conversation>('wf-conversations-v1', initialConversations)
  const [selectedId, setSelectedId] = useState(() => conversations[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [reply, setReply] = useState('')
  const selected = conversations.find((item) => item.id === selectedId) ?? conversations[0]
  const visible = useMemo(() => conversations.filter((item) => `${item.contact} ${item.company}`.toLowerCase().includes(query.toLowerCase()) && (!onlyUnread || item.unread)), [conversations, query, onlyUnread])

  const open = (id: string) => {
    setSelectedId(id)
    setConversations((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item))
  }
  const send = () => {
    if (!selected || !reply.trim()) return
    const message: Message = { id: `message-${Date.now()}`, sender: 'user', body: reply.trim(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
    setConversations((current) => current.map((item) => item.id === selected.id ? { ...item, messages: [...item.messages, message], updatedAt: message.time } : item))
    setReply('')
    notify('Mensagem adicionada à conversa local.', 'success')
  }

  return <div className="page page--wide conversations-page"><PageHeader eyebrow="Relacionamento" title="Conversas" description="Uma caixa de entrada para acompanhar contatos, contexto e próximos passos." actions={<Button onClick={openTaskComposer}><Plus size={16} /> Criar tarefa</Button>} />
    <div className="inbox-shell">
      <aside className="inbox-list"><div className="inbox-list__toolbar"><div className="search-field"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar conversas..." /></div><button className={onlyUnread ? 'active' : ''} onClick={() => setOnlyUnread((current) => !current)}><Circle size={14} /> Não lidas</button></div><div className="inbox-items">{visible.map((conversation) => <button key={conversation.id} className={`${conversation.id === selected?.id ? 'active' : ''} ${conversation.unread ? 'unread' : ''}`} onClick={() => open(conversation.id)}><Avatar name={conversation.contact} /><span><strong>{conversation.contact}{conversation.unread ? <i /> : null}</strong><small>{conversation.messages.at(-1)?.body}</small><em>{conversation.channel} · {conversation.company}</em></span><time>{conversation.updatedAt}</time></button>)}</div></aside>
      {selected ? <section className="conversation-thread"><header><div><Avatar name={selected.contact} /><span><strong>{selected.contact}</strong><small>{selected.company} · {selected.channel}</small></span></div><div><button aria-label="Marcar como resolvida"><Check size={16} /></button><button><MoreHorizontal size={16} /></button></div></header><div className="conversation-messages">{selected.messages.map((message) => <div key={message.id} className={`conversation-message conversation-message--${message.sender}`}><p>{message.body}</p><time>{message.time}</time></div>)}</div><footer><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Responder a ${selected.contact}...`} /><div><span>Envio externo desativado nesta versão</span><Button variant="primary" disabled={!reply.trim()} onClick={send}><Send size={15} /> Enviar</Button></div></footer></section> : <EmptyState icon={<MessageSquareMore />} title="Selecione uma conversa" description="Escolha um contato para visualizar o histórico." />}
      {selected ? <aside className="conversation-context"><div className="conversation-context__profile"><Avatar name={selected.contact} size="lg" /><h3>{selected.contact}</h3><p>{selected.company}</p><Badge tone="blue">{selected.channel}</Badge></div><section><h4>Responsável</h4><span><Avatar name={selected.assignedTo} size="sm" /> {selected.assignedTo}</span></section><section><h4>Tags</h4><div>{selected.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></section><section><h4>Ações</h4><button onClick={() => navigate('/crm/contacts')}><UsersRound size={15} /> Abrir contato <ArrowRight size={14} /></button><button onClick={openTaskComposer}><Plus size={15} /> Criar tarefa <ArrowRight size={14} /></button><button onClick={() => navigate('/calendar')}><CalendarPlus size={15} /> Agendar reunião <ArrowRight size={14} /></button></section></aside> : null}
    </div>
  </div>
}
