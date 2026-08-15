import { useState } from 'react'
import {
  ArrowRight, Bot, Check, CirclePause, Clock3, Database, Globe2, Mail,
  MoreHorizontal, Play, Plus, Search, ShieldCheck, Sparkles, UserCheck,
  Workflow, Zap,
} from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui'
import { useApp } from '../context/AppContext'

const workflows = [
  {
    name: 'Qualificar novo lead',
    description: 'Pesquisa a empresa, enriquece dados, calcula score e prepara o primeiro contato.',
    trigger: 'Novo lead criado',
    runs: '48 execuções',
    success: '96%',
    active: true,
    steps: [Globe2, Database, Sparkles, Mail],
  },
  {
    name: 'Onboarding de cliente',
    description: 'Cria projeto, aplica template, abre portal e agenda reunião de kickoff.',
    trigger: 'Proposta aprovada',
    runs: '12 execuções',
    success: '100%',
    active: true,
    steps: [Check, Workflow, UserCheck, Mail],
  },
  {
    name: 'Resumo semanal de projetos',
    description: 'Consolida progresso, riscos e próximos passos antes de enviar para aprovação.',
    trigger: 'Toda sexta, 16:00',
    runs: '31 execuções',
    success: '93%',
    active: false,
    steps: [Clock3, Database, Bot, UserCheck],
  },
]

const runs = [
  ['Qualificar novo lead', 'Acme Flooring LLC', 'Concluída', 'há 3 min'],
  ['Resumo semanal de projetos', 'Workspace principal', 'Aguardando aprovação', 'há 18 min'],
  ['Onboarding de cliente', 'Clínica Aurora', 'Concluída', 'há 1h'],
  ['Qualificar novo lead', 'Stoneworks Miami', 'Concluída', 'há 2h'],
]

export function AutomationsPage() {
  const { notify } = useApp()
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() => Object.fromEntries(workflows.map((workflow) => [workflow.name, workflow.active])))
  const [query, setQuery] = useState('')
  const visibleWorkflows = workflows.filter((workflow) => workflow.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="page page--wide automations-page">
      <PageHeader
        eyebrow="Automação e agentes"
        title="Automações"
        description="Conecte eventos, dados, IA e aprovações humanas em fluxos seguros para o trabalho repetitivo."
        actions={<><Button onClick={() => notify('Galeria de modelos aberta.')}><Sparkles size={15} /> Usar modelo</Button><Button variant="primary" onClick={() => notify('Novo workflow iniciado.', 'success')}><Plus size={16} /> Nova automação</Button></>}
      />

      <div className="automation-stat-grid">
        <Card><span className="automation-stat__icon"><Workflow size={18} /></span><span>Workflows ativos</span><strong>8</strong><small>3 executaram hoje</small></Card>
        <Card><span className="automation-stat__icon automation-stat__icon--green"><Check size={18} /></span><span>Taxa de sucesso</span><strong>96,4%</strong><small>Últimos 30 dias</small></Card>
        <Card><span className="automation-stat__icon automation-stat__icon--orange"><Clock3 size={18} /></span><span>Tempo economizado</span><strong>47h</strong><small>Estimativa mensal</small></Card>
        <Card><span className="automation-stat__icon automation-stat__icon--blue"><ShieldCheck size={18} /></span><span>Aguardando aprovação</span><strong>3</strong><small>Nenhuma ação crítica</small></Card>
      </div>

      <div className="automation-layout">
        <section className="automation-main">
          <Card className="automation-canvas-card">
            <div className="card-heading-row">
              <div><h2>Fluxo em destaque</h2><p>Uma visão simples do que acontece quando um novo lead entra.</p></div>
              <Badge tone="green"><span className="live-dot" /> Ativo</Badge>
            </div>
            <div className="workflow-canvas" aria-label="Fluxo de qualificação de leads">
              <button className="workflow-node workflow-node--trigger" onClick={() => notify('Gatilho: novo lead criado.')}><Zap size={17} /><span><small>Quando</small><strong>Novo lead criado</strong></span></button>
              <span className="workflow-connector"><ArrowRight size={16} /></span>
              <button className="workflow-node" onClick={() => notify('Pesquisa e enriquecimento.')}><Globe2 size={17} /><span><small>Pesquisar</small><strong>Empresa e site</strong></span></button>
              <span className="workflow-connector"><ArrowRight size={16} /></span>
              <button className="workflow-node workflow-node--ai" onClick={() => notify('Agente de IA: análise e score.')}><Bot size={17} /><span><small>Agente de IA</small><strong>Analisar e pontuar</strong></span></button>
              <span className="workflow-connector"><ArrowRight size={16} /></span>
              <button className="workflow-node" onClick={() => notify('Aprovação humana obrigatória.')}><UserCheck size={17} /><span><small>Aprovação</small><strong>Revisar contato</strong></span></button>
              <span className="workflow-connector"><ArrowRight size={16} /></span>
              <button className="workflow-node workflow-node--success" onClick={() => notify('Email enviado e follow-up criado.')}><Mail size={17} /><span><small>Ação</small><strong>Enviar e acompanhar</strong></span></button>
            </div>
            <div className="workflow-canvas__footer"><span><ShieldCheck size={14} /> Envio de email exige aprovação</span><span><Clock3 size={14} /> Média: 38 segundos</span><button onClick={() => notify('Editor visual do fluxo aberto.')}>Editar fluxo <ArrowRight size={14} /></button></div>
          </Card>

          <div className="automation-list-heading">
            <div><h2>Seus workflows</h2><p>Automações prontas para executar ou ajustar.</p></div>
            <div className="search-field automation-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar automações..." /></div>
          </div>

          <div className="workflow-card-grid">
            {visibleWorkflows.map((workflow) => (
              <Card className="workflow-card interactive-card" key={workflow.name}>
                <div className="workflow-card__header">
                  <span className="workflow-card__mark"><Workflow size={18} /></span>
                  <button className={`toggle-switch ${activeMap[workflow.name] ? 'toggle-switch--active' : ''}`} onClick={() => setActiveMap((current) => ({ ...current, [workflow.name]: !current[workflow.name] }))} aria-label={`${activeMap[workflow.name] ? 'Pausar' : 'Ativar'} ${workflow.name}`}><i /></button>
                  <button className="icon-button icon-button--quiet"><MoreHorizontal size={16} /></button>
                </div>
                <h3>{workflow.name}</h3>
                <p>{workflow.description}</p>
                <div className="workflow-mini-path">
                  {workflow.steps.map((StepIcon, index) => <span key={index}><StepIcon size={14} />{index < workflow.steps.length - 1 ? <i /> : null}</span>)}
                </div>
                <div className="workflow-card__meta"><span><small>Gatilho</small><strong>{workflow.trigger}</strong></span><span><small>Execuções</small><strong>{workflow.runs}</strong></span><span><small>Sucesso</small><strong>{workflow.success}</strong></span></div>
              </Card>
            ))}
          </div>
        </section>

        <aside className="automation-side">
          <Card>
            <div className="card-heading-row"><div><h2>Aprovações</h2><p>Ações preparadas pela IA.</p></div><Badge tone="orange">3</Badge></div>
            <div className="approval-list">
              <button onClick={() => notify('Prévia do email aberta.')}><span className="approval-list__icon"><Mail size={15} /></span><span><strong>Email para Acme Flooring</strong><small>Preparado pela automação de leads</small></span><ArrowRight size={14} /></button>
              <button onClick={() => notify('Alterações do projeto abertas.')}><span className="approval-list__icon approval-list__icon--purple"><Workflow size={15} /></span><span><strong>Criar projeto e 18 tarefas</strong><small>Onboarding · Northstar</small></span><ArrowRight size={14} /></button>
              <button onClick={() => notify('Relatório semanal aberto.')}><span className="approval-list__icon approval-list__icon--green"><Bot size={15} /></span><span><strong>Enviar resumo semanal</strong><small>4 clientes receberão o relatório</small></span><ArrowRight size={14} /></button>
            </div>
            <Button className="automation-side__button" onClick={() => notify('Central de aprovações aberta.')}>Ver central de aprovações <ArrowRight size={14} /></Button>
          </Card>

          <Card>
            <div className="card-heading-row"><div><h2>Execuções recentes</h2><p>Histórico com contexto e rastreabilidade.</p></div><button className="icon-button icon-button--quiet"><CirclePause size={16} /></button></div>
            <div className="automation-run-list">
              {runs.map(([name, context, status, time]) => <button key={`${name}-${context}`} onClick={() => notify(`Log aberto: ${name}`)}><span className={`run-dot ${status.includes('Aguardando') ? 'run-dot--orange' : ''}`} /><span><strong>{name}</strong><small>{context}</small></span><span><Badge tone={status.includes('Aguardando') ? 'orange' : 'green'}>{status}</Badge><small>{time}</small></span></button>)}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
