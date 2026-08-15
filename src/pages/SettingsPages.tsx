import { Check, CircleAlert, RotateCcw, Settings2, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, PageHeader } from '../components/ui'
import { moduleCatalog } from '../data/moduleCatalog'
import { useApp } from '../context/AppContext'

export function ModulesSettingsPage() {
  const { workspaceConfig, toggleWorkspaceModule, notify } = useApp()
  const enabled = new Set(workspaceConfig?.enabledModules ?? [])

  const toggle = (id: Parameters<typeof toggleWorkspaceModule>[0]) => {
    const result = toggleWorkspaceModule(id)
    notify(result.message, result.ok ? 'success' : 'error')
  }

  return <div className="page page--wide settings-page"><PageHeader eyebrow="Configurações" title="Módulos do workspace" description="Mantenha a navegação simples e ative apenas o que sua equipe realmente utiliza." />
    <Card className="settings-notice"><Settings2 size={19} /><span><strong>O workspace é configurável.</strong><small>As alterações aparecem imediatamente na sidebar e ficam salvas neste navegador.</small></span></Card>
    <div className="settings-module-groups">{['Relacionamento', 'Crescimento', 'Operação', 'Análise', 'Administração'].map((category) => {
      const modules = moduleCatalog.filter((item) => item.category === category)
      if (!modules.length) return null
      return <section key={category}><header><div><h2>{category}</h2><p>{modules.filter((item) => enabled.has(item.id)).length} de {modules.length} módulos ativos</p></div></header><div className="settings-module-grid">{modules.map((module) => { const Icon = module.icon; const active = enabled.has(module.id); return <Card className={`settings-module-card ${active ? 'active' : ''}`} key={module.id}><div className="settings-module-card__header"><span><Icon size={18} /></span><Badge tone={module.status === 'functional' ? 'green' : 'orange'}>{module.status === 'functional' ? 'Funcional' : 'Simulado'}</Badge></div><h3>{module.label}</h3><p>{module.description}</p>{module.dependencies?.length ? <small className="module-dependency"><CircleAlert size={13} /> Depende de {module.dependencies.map((id) => moduleCatalog.find((item) => item.id === id)?.label).join(', ')}</small> : null}<button className={`module-toggle ${active ? 'module-toggle--active' : ''}`} disabled={module.required} onClick={() => toggle(module.id)} aria-pressed={active}><i>{active ? <Check size={13} /> : null}</i><span>{module.required ? 'Obrigatório' : active ? 'Ativo' : 'Inativo'}</span></button></Card> })}</div></section>
    })}</div>
  </div>
}

export function WorkspaceSettingsPage() {
  const navigate = useNavigate()
  const { workspaceConfig, resetWorkspace, notify } = useApp()
  if (!workspaceConfig) return null
  const business = workspaceConfig.business
  return <div className="page settings-page"><PageHeader eyebrow="Configurações" title="Workspace" description="Informações usadas para personalizar a experiência do WorkForge." />
    <Card className="workspace-profile-card"><div className="workspace-profile-card__hero"><span>{business.name.slice(0, 2).toUpperCase()}</span><div><h2>{business.name}</h2><p>{business.industry} · {business.city}/{business.state}</p></div><Badge tone="green">Configurado</Badge></div><div className="workspace-profile-grid"><div><span>Equipe</span><strong>{business.teamSize}</strong></div><div><span>Clientes</span><strong>{business.clientVolume || 'Não informado'}</strong></div><div><span>Módulos ativos</span><strong>{workspaceConfig.enabledModules.length}</strong></div><div><span>Versão da configuração</span><strong>v{workspaceConfig.version}</strong></div></div></Card>
    <Card className="workspace-config-card"><h2>Perfil operacional</h2><div className="workspace-config-list"><div><span>Modelos de operação</span><strong>{business.operatingModels.join(', ')}</strong></div><div><span>Aquisição</span><strong>{business.acquisitionChannels.join(', ')}</strong></div><div><span>Comunicação</span><strong>{business.communicationChannels.join(', ')}</strong></div><div><span>Prioridades</span><strong>{business.needs.join(', ')}</strong></div></div></Card>
    <Card className="danger-zone"><ShieldCheck size={20} /><div><h2>Refazer configuração</h2><p>Remove apenas o mapa do workspace e abre novamente o onboarding. Tarefas e demais dados locais são preservados.</p></div><Button variant="danger" onClick={() => { resetWorkspace(); notify('Configuração removida. Abra novamente o onboarding.', 'success'); navigate('/onboarding', { replace: true }) }}><RotateCcw size={15} /> Refazer onboarding</Button></Card>
  </div>
}
