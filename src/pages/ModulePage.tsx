import { useState } from 'react'
import { ArrowRight, Filter, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Badge, Button, Card, Drawer, Modal, PageHeader } from '../components/ui'
import { moduleDefinitions } from '../data/modules'
import { useApp } from '../context/AppContext'

type Row = { title: string; meta: string; status: string; tone?: 'green' | 'orange' | 'purple' | 'blue' }

export function ModulePage({ id }: { id: string }) {
  const definition = moduleDefinitions[id] ?? {
    title: 'Módulo', description: 'Página preparada para a próxima etapa do frontend.', primaryAction: 'Nova ação',
    stats: [
      { label: 'Itens ativos', value: '24', hint: '+4 esta semana' },
      { label: 'Concluídos', value: '82%', hint: '+7% no mês' },
      { label: 'Atualizações', value: '12', hint: 'Hoje' },
    ],
    rows: [
      { title: 'Visão principal', meta: 'Conteúdo simulado e centralizado.', status: 'Disponível', tone: 'green' as const },
      { title: 'Configurações', meta: 'Estrutura pronta para backend.', status: 'Preparada', tone: 'purple' as const },
    ],
  }
  const { notify, setAiOpen } = useApp()
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [selected, setSelected] = useState<Row | null>(null)
  const filtered = definition.rows.filter((row) => row.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page">
      <PageHeader eyebrow={definition.eyebrow} title={definition.title} description={definition.description} actions={<><Button onClick={() => setAiOpen(true)}><Sparkles size={15} /> Usar IA</Button><Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> {definition.primaryAction}</Button></>} />
      <div className="module-stat-grid">{definition.stats.map((stat, index) => <Card className="module-stat interactive-card" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.hint}</small><i className={`module-stat__line module-stat__line--${index + 1}`} /></Card>)}</div>
      <div className="module-layout">
        <Card>
          <div className="card-heading-row"><div><h2>Visão atual</h2><p>Dados simulados para validar o fluxo e a hierarquia visual.</p></div><Button onClick={() => setCreateOpen(true)}><SlidersHorizontal size={15} /> Configurar</Button></div>
          <div className="toolbar toolbar--inside"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." /></div><Button><Filter size={15} /> Filtros</Button></div>
          <div className="module-row-list">{filtered.map((row) => <button key={row.title} onClick={() => setSelected(row)}><span className="module-row-list__bullet" /><span><strong>{row.title}</strong><small>{row.meta}</small></span><Badge tone={row.tone}>{row.status}</Badge><ArrowRight size={15} /></button>)}</div>
        </Card>
        <Card className="module-side-card"><span className="eyebrow">Próxima melhor ação</span><div className="module-side-card__icon"><Sparkles size={19} /></div><h2>Organize antes de automatizar</h2><p>A estrutura desta tela separa ações, dados e feedback. A próxima etapa é conectar estes estados ao backend.</p><Button variant="primary" onClick={() => setAiOpen(true)}>Analisar com IA <ArrowRight size={15} /></Button><div className="module-side-card__meta"><span><strong>88%</strong><small>confiança</small></span><span><strong>4 min</strong><small>tempo estimado</small></span></div></Card>
      </div>
      {createOpen ? <Modal title={definition.primaryAction} description={`Cadastre um novo item em ${definition.title}.`} onClose={() => setCreateOpen(false)}><div className="composer-form"><label className="field field--full"><span>Título</span><input autoFocus placeholder="Nome do item" /></label><label className="field field--full"><span>Descrição</span><textarea rows={4} placeholder="Contexto e observações..." /></label><div className="form-grid"><label className="field"><span>Status</span><select><option>Ativo</option><option>Rascunho</option><option>Concluído</option></select></label><label className="field"><span>Responsável</span><select><option>Rafael Martins</option><option>Camila Rocha</option></select></label></div><div className="modal-actions"><Button onClick={() => setCreateOpen(false)}>Cancelar</Button><Button variant="primary" onClick={() => { setCreateOpen(false); notify('Item criado localmente.', 'success') }}>Salvar</Button></div></div></Modal> : null}
      {selected ? <Drawer title={selected.title} description={selected.meta} onClose={() => setSelected(null)}><div className="entity-detail"><Badge tone={selected.tone}>{selected.status}</Badge><section className="detail-section"><h4>Detalhes</h4><p>Este painel representa o detalhe do registro e substitui o antigo aviso em forma de toast.</p></section><section className="detail-section"><h4>Atividade</h4><div className="activity-timeline"><div><i /><span><strong>Registro atualizado</strong><small>Hoje, 10:42</small></span></div><div><i /><span><strong>Status alterado</strong><small>Ontem, 16:20</small></span></div></div></section><Button variant="primary">Editar registro</Button></div></Drawer> : null}
    </div>
  )
}
