import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, LogOut, MessageCircleMore,
  Rocket, Settings2, SkipForward, Sparkles, Target, UsersRound,
} from 'lucide-react'
import { Button, Card } from '../components/ui'
import { defaultEnabledModules, moduleCatalog, recommendModules } from '../data/moduleCatalog'
import { useApp } from '../context/AppContext'
import type { BusinessProfile, WorkspaceModuleId } from '../types/workspace'

const industries = [
  'Agência e marketing', 'Consultoria', 'Serviços profissionais', 'Arquitetura e engenharia',
  'Saúde e estética', 'Imobiliário', 'Serviços residenciais', 'Educação', 'Tecnologia',
  'Comércio', 'Vendas e representação', 'Outro',
]
const operatingModels = ['Projetos', 'Serviços recorrentes', 'Atendimentos agendados', 'Vendas consultivas', 'Venda de produtos', 'Serviços no local', 'Mensalidades', 'Comissões', 'Contratos']
const acquisitionChannels = ['Indicação', 'WhatsApp', 'Instagram', 'Facebook', 'Google', 'Anúncios', 'Site', 'Prospecção ativa', 'Eventos', 'Parceiros', 'Importação de listas']
const communicationChannels = ['WhatsApp', 'Email', 'Telefone', 'Instagram', 'Facebook', 'Reuniões', 'SMS', 'Chat do site']
const needs = ['Organizar contatos', 'Acompanhar oportunidades', 'Centralizar conversas', 'Automatizar follow-ups', 'Agendar reuniões', 'Criar propostas', 'Organizar projetos', 'Organizar tarefas', 'Captar leads', 'Criar formulários', 'Criar páginas', 'Gerenciar redes sociais', 'Solicitar avaliações', 'Acompanhar resultados', 'Controlar equipe']

const stepMeta = [
  { title: 'Sua empresa', description: 'O contexto básico para personalizar o workspace.', icon: Building2 },
  { title: 'Como você trabalha', description: 'Os modelos operacionais usados no dia a dia.', icon: UsersRound },
  { title: 'Aquisição e comunicação', description: 'De onde chegam os clientes e por onde sua equipe conversa.', icon: MessageCircleMore },
  { title: 'Prioridades', description: 'Os problemas que o WorkForge precisa ajudar a resolver.', icon: Target },
  { title: 'Seu workspace', description: 'Revise os módulos recomendados antes de começar.', icon: Sparkles },
]

type Draft = {
  name: string
  industry: string
  city: string
  state: string
  website: string
  teamSize: string
  clientVolume: string
  operatingModels: string[]
  acquisitionChannels: string[]
  communicationChannels: string[]
  needs: string[]
}

const initialDraft: Draft = {
  name: '', industry: '', city: '', state: '', website: '', teamSize: '', clientVolume: '',
  operatingModels: [], acquisitionChannels: [], communicationChannels: [], needs: [],
}

function toggleValue(items: string[], value: string) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value]
}

function ChipGroup({ options, values, onChange, label }: { options: string[]; values: string[]; onChange: (values: string[]) => void; label: string }) {
  return (
    <fieldset className="onboarding-chip-field">
      <legend>{label}</legend>
      <div>{options.map((option) => <button type="button" key={option} className={values.includes(option) ? 'selected' : ''} onClick={() => onChange(toggleValue(values, option))}>{values.includes(option) ? <Check size={14} /> : null}{option}</button>)}</div>
    </fieldset>
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding, workspaceConfig } = useApp()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>(() => workspaceConfig ? {
    name: workspaceConfig.business.name,
    industry: workspaceConfig.business.industry,
    city: workspaceConfig.business.city,
    state: workspaceConfig.business.state,
    website: workspaceConfig.business.website ?? '',
    teamSize: workspaceConfig.business.teamSize,
    clientVolume: workspaceConfig.business.clientVolume,
    operatingModels: workspaceConfig.business.operatingModels,
    acquisitionChannels: workspaceConfig.business.acquisitionChannels,
    communicationChannels: workspaceConfig.business.communicationChannels,
    needs: workspaceConfig.business.needs,
  } : { ...initialDraft, name: localStorage.getItem('wf-signup-workspace') ?? '' })
  const recommended = useMemo(() => recommendModules(draft.needs, draft.operatingModels), [draft.needs, draft.operatingModels])
  const [manualModules, setManualModules] = useState<WorkspaceModuleId[] | null>(null)
  const selectedModules = manualModules ?? recommended

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const canContinue = [
    Boolean(draft.name.trim() && draft.industry && draft.city.trim() && draft.state && draft.teamSize),
    draft.operatingModels.length > 0,
    draft.acquisitionChannels.length > 0 && draft.communicationChannels.length > 0,
    draft.needs.length >= 2,
    selectedModules.length > 0,
  ][step]

  const toggleModule = (id: WorkspaceModuleId) => {
    const module = moduleCatalog.find((item) => item.id === id)
    if (module?.required) return
    setManualModules((current) => {
      const base = current ?? recommended
      return base.includes(id) ? base.filter((item) => item !== id) : [...base, id]
    })
  }

  const finish = () => {
    const business: BusinessProfile = {
      id: `business-${Date.now()}`,
      name: draft.name.trim(), industry: draft.industry, city: draft.city.trim(), state: draft.state,
      website: draft.website.trim() || undefined, teamSize: draft.teamSize, clientVolume: draft.clientVolume,
      operatingModels: draft.operatingModels, acquisitionChannels: draft.acquisitionChannels,
      communicationChannels: draft.communicationChannels, needs: draft.needs,
    }
    completeOnboarding(business, selectedModules)
    navigate('/dashboard', { replace: true })
  }

  const useBasicWorkspace = () => {
    const business: BusinessProfile = {
      id: `business-${Date.now()}`,
      name: draft.name.trim() || localStorage.getItem('wf-signup-workspace')?.trim() || 'Minha empresa',
      industry: draft.industry || 'Serviços profissionais',
      city: draft.city.trim() || 'São Paulo',
      state: draft.state || 'SP',
      website: draft.website.trim() || undefined,
      teamSize: draft.teamSize || 'Somente eu',
      clientVolume: draft.clientVolume || 'Estou começando',
      operatingModels: draft.operatingModels.length ? draft.operatingModels : ['Projetos'],
      acquisitionChannels: draft.acquisitionChannels.length ? draft.acquisitionChannels : ['Indicação'],
      communicationChannels: draft.communicationChannels.length ? draft.communicationChannels : ['WhatsApp'],
      needs: draft.needs.length >= 2 ? draft.needs : ['Organizar contatos', 'Organizar tarefas'],
    }
    completeOnboarding(business, defaultEnabledModules)
    localStorage.removeItem('wf-signup-workspace')
    navigate('/dashboard', { replace: true })
  }

  const exitOnboarding = () => {
    localStorage.removeItem('wf-demo-user')
    localStorage.removeItem('wf-signup-workspace')
    navigate('/login', { replace: true })
  }

  const StepIcon = stepMeta[step].icon

  return (
    <main className="onboarding-layout">
      <aside className="onboarding-sidebar">
        <div className="onboarding-brand"><span>W</span><strong>WORKFORGE</strong></div>
        <div className="onboarding-intro"><span className="eyebrow">Configuração inicial</span><h1>Um sistema alinhado à sua operação.</h1><p>Em poucos passos, vamos escolher os módulos que fazem sentido para sua empresa.</p></div>
        <ol className="onboarding-steps">{stepMeta.map((item, index) => {
          const Icon = item.icon
          return <li key={item.title} className={index === step ? 'active' : index < step ? 'complete' : ''}><span>{index < step ? <Check size={15} /> : <Icon size={15} />}</span><div><strong>{item.title}</strong><small>{item.description}</small></div></li>
        })}</ol>
        <div className="onboarding-security"><CheckCircle2 size={17} /><span><strong>Configuração local segura</strong><small>Nenhuma integração externa será ativada sem sua autorização.</small></span></div>
      </aside>

      <section className="onboarding-main">
        <header className="onboarding-header">
          <div><span>Etapa {step + 1} de {stepMeta.length}</span><i><b style={{ width: `${((step + 1) / stepMeta.length) * 100}%` }} /></i></div>
          <div className="onboarding-header__actions">
            <button type="button" className="onboarding-skip" onClick={useBasicWorkspace}><SkipForward size={14} /> Usar sistema básico</button>
            <button type="button" className="onboarding-exit" onClick={exitOnboarding}><LogOut size={14} /> Sair</button>
          </div>
        </header>
        <div className="onboarding-content">
          <div className="onboarding-title"><span><StepIcon size={20} /></span><div><h2>{stepMeta[step].title}</h2><p>{stepMeta[step].description}</p></div></div>

          {step === 0 ? <Card className="onboarding-card"><div className="onboarding-form-grid">
            <label className="field field--full"><span>Nome da empresa <b className="required-mark">*</b></span><input autoFocus value={draft.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex.: NovaVia Consultoria" /></label>
            <label className="field field--full"><span>Segmento <b className="required-mark">*</b></span><select value={draft.industry} onChange={(event) => update('industry', event.target.value)}><option value="">Selecione</option>{industries.map((industry) => <option key={industry}>{industry}</option>)}</select></label>
            <label className="field"><span>Cidade <b className="required-mark">*</b></span><input value={draft.city} onChange={(event) => update('city', event.target.value)} placeholder="São Paulo" /></label>
            <label className="field"><span>Estado <b className="required-mark">*</b></span><select value={draft.state} onChange={(event) => update('state', event.target.value)}><option value="">UF</option>{['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((state) => <option key={state}>{state}</option>)}</select></label>
            <label className="field"><span>Tamanho da equipe <b className="required-mark">*</b></span><select value={draft.teamSize} onChange={(event) => update('teamSize', event.target.value)}><option value="">Selecione</option><option>Somente eu</option><option>2–5 pessoas</option><option>6–15 pessoas</option><option>16–50 pessoas</option><option>Mais de 50 pessoas</option></select></label>
            <label className="field"><span>Clientes ativos</span><select value={draft.clientVolume} onChange={(event) => update('clientVolume', event.target.value)}><option value="">Selecione</option><option>Estou começando</option><option>1–10</option><option>11–50</option><option>51–200</option><option>Mais de 200</option></select></label>
            <label className="field field--full"><span>Site <em>opcional</em></span><input value={draft.website} onChange={(event) => update('website', event.target.value)} placeholder="https://suaempresa.com.br" /></label>
          </div><p className="onboarding-required-hint"><span>*</span> Preencha os campos obrigatórios para continuar ou use a configuração básica.</p></Card> : null}

          {step === 1 ? <Card className="onboarding-card"><ChipGroup label="Como sua empresa entrega e cobra pelos serviços?" options={operatingModels} values={draft.operatingModels} onChange={(values) => update('operatingModels', values)} /><div className="onboarding-tip"><Rocket size={17} /><span><strong>Você pode escolher mais de uma opção.</strong><small>Uma agência, por exemplo, pode trabalhar com mensalidades e projetos avulsos.</small></span></div></Card> : null}

          {step === 2 ? <div className="onboarding-card-stack"><Card className="onboarding-card"><ChipGroup label="Como os clientes chegam até você?" options={acquisitionChannels} values={draft.acquisitionChannels} onChange={(values) => update('acquisitionChannels', values)} /></Card><Card className="onboarding-card"><ChipGroup label="Quais canais sua equipe usa para conversar?" options={communicationChannels} values={draft.communicationChannels} onChange={(values) => update('communicationChannels', values)} /></Card></div> : null}

          {step === 3 ? <Card className="onboarding-card"><ChipGroup label="Selecione pelo menos duas prioridades" options={needs} values={draft.needs} onChange={(values) => update('needs', values)} /><div className="onboarding-tip"><Target size={17} /><span><strong>As prioridades definem o workspace inicial.</strong><small>Você poderá ativar ou remover módulos depois.</small></span></div></Card> : null}

          {step === 4 ? <div className="onboarding-review">
            <Card className="onboarding-summary"><div><span className="business-avatar">{draft.name.slice(0, 2).toUpperCase()}</span><span><strong>{draft.name}</strong><small>{draft.industry} · {draft.city}/{draft.state}</small></span></div><dl><div><dt>Modelo</dt><dd>{draft.operatingModels.join(', ')}</dd></div><div><dt>Aquisição</dt><dd>{draft.acquisitionChannels.join(', ')}</dd></div><div><dt>Prioridades</dt><dd>{draft.needs.slice(0, 4).join(', ')}</dd></div></dl></Card>
            <div className="onboarding-module-heading"><div><h3>Módulos recomendados</h3><p>Ative apenas o que sua equipe precisa agora.</p></div><span>{selectedModules.length} ativos</span></div>
            <div className="onboarding-module-grid">{moduleCatalog.map((module) => { const enabled = selectedModules.includes(module.id); const Icon = module.icon; return <button type="button" key={module.id} className={enabled ? 'enabled' : ''} onClick={() => toggleModule(module.id)} aria-pressed={enabled}><span className="onboarding-module-icon"><Icon size={18} /></span><span><strong>{module.label}</strong><small>{module.description}</small><em>{module.status === 'functional' ? 'Funcional' : 'Simulado nesta versão'}</em></span><i>{module.required ? 'Obrigatório' : enabled ? <Check size={14} /> : <Settings2 size={14} />}</i></button> })}</div>
          </div> : null}
        </div>
        <footer className="onboarding-footer"><Button variant="ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft size={16} /> Voltar</Button>{step < stepMeta.length - 1 ? <Button variant="primary" disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>Continuar <ArrowRight size={16} /></Button> : <Button variant="primary" disabled={!canContinue} onClick={finish}>Criar meu workspace <Rocket size={16} /></Button>}</footer>
      </section>
    </main>
  )
}
