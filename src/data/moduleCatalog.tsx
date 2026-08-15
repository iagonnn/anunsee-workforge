import {
  BarChart3, Building2, CalendarDays, ContactRound, FolderKanban, Globe2,
  Inbox, LayoutDashboard, Megaphone, MessageSquareMore, PlugZap, Settings2,
  ShieldCheck, Sparkles, Star, UsersRound, Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { WorkspaceModuleId, WorkspaceModuleStatus } from '../types/workspace'

export type ModuleCatalogItem = {
  id: WorkspaceModuleId
  label: string
  description: string
  category: 'Principal' | 'Relacionamento' | 'Crescimento' | 'Operação' | 'Análise' | 'Administração'
  route: string
  icon: LucideIcon
  required?: boolean
  status: WorkspaceModuleStatus
  dependencies?: WorkspaceModuleId[]
}

export const moduleCatalog: ModuleCatalogItem[] = [
  { id: 'dashboard', label: 'Início', description: 'Resumo do que precisa de atenção hoje.', category: 'Principal', route: '/dashboard', icon: LayoutDashboard, required: true, status: 'functional' },
  { id: 'conversations', label: 'Conversas', description: 'Caixa de entrada de clientes e leads.', category: 'Relacionamento', route: '/conversations', icon: MessageSquareMore, status: 'functional' },
  { id: 'contacts', label: 'Contatos', description: 'Pessoas, histórico, tags e responsáveis.', category: 'Relacionamento', route: '/crm/contacts', icon: ContactRound, status: 'functional' },
  { id: 'companies', label: 'Empresas', description: 'Organizações, relacionamentos e oportunidades.', category: 'Relacionamento', route: '/crm/companies', icon: Building2, status: 'functional' },
  { id: 'opportunities', label: 'Oportunidades', description: 'Pipeline comercial e próximas ações.', category: 'Relacionamento', route: '/crm/opportunities', icon: Inbox, status: 'functional', dependencies: ['contacts'] },
  { id: 'calendar', label: 'Calendário', description: 'Reuniões, compromissos e agendamentos.', category: 'Crescimento', route: '/calendar', icon: CalendarDays, status: 'functional' },
  { id: 'automations', label: 'Automações', description: 'Workflows, aprovações e execuções.', category: 'Crescimento', route: '/automation/workflows', icon: Workflow, status: 'functional' },
  { id: 'marketing', label: 'Marketing', description: 'Campanhas, conteúdo e calendário editorial.', category: 'Crescimento', route: '/marketing', icon: Megaphone, status: 'simulated' },
  { id: 'sites', label: 'Sites e formulários', description: 'Páginas, formulários e captação.', category: 'Crescimento', route: '/sites', icon: Globe2, status: 'simulated' },
  { id: 'reputation', label: 'Reputação', description: 'Avaliações, solicitações e respostas.', category: 'Crescimento', route: '/reputation', icon: Star, status: 'simulated' },
  { id: 'projects', label: 'Projetos', description: 'Portfólio de entregas e progresso.', category: 'Operação', route: '/execution/projects', icon: FolderKanban, status: 'functional' },
  { id: 'tasks', label: 'Tarefas', description: 'Trabalho, responsáveis, prazos e prioridades.', category: 'Operação', route: '/execution/tasks', icon: ShieldCheck, status: 'functional' },
  { id: 'reports', label: 'Relatórios', description: 'Indicadores comerciais e operacionais.', category: 'Análise', route: '/reports', icon: BarChart3, status: 'simulated' },
  { id: 'team', label: 'Equipe', description: 'Pessoas, funções e capacidade.', category: 'Administração', route: '/settings/team', icon: UsersRound, status: 'simulated' },
  { id: 'integrations', label: 'Integrações', description: 'Conectores e sincronizações futuras.', category: 'Administração', route: '/settings/integrations', icon: PlugZap, status: 'simulated' },
  { id: 'settings', label: 'Configurações', description: 'Workspace, módulos e preferências.', category: 'Administração', route: '/settings/modules', icon: Settings2, required: true, status: 'functional' },
]

export const defaultEnabledModules: WorkspaceModuleId[] = [
  'dashboard', 'conversations', 'contacts', 'companies', 'opportunities', 'calendar',
  'automations', 'projects', 'tasks', 'reports', 'settings',
]

export function recommendModules(needs: string[], operatingModels: string[]): WorkspaceModuleId[] {
  const selected = new Set<WorkspaceModuleId>(defaultEnabledModules)
  const has = (...terms: string[]) => [...needs, ...operatingModels].some((item) => terms.some((term) => item.toLowerCase().includes(term)))

  if (has('captar leads', 'páginas', 'formulários', 'redes sociais')) {
    selected.add('marketing')
    selected.add('sites')
  }
  if (has('avaliações')) selected.add('reputation')
  if (has('equipe')) selected.add('team')
  if (has('agendados', 'reuniões')) selected.add('calendar')
  if (has('projetos', 'tarefas')) {
    selected.add('projects')
    selected.add('tasks')
  }

  return moduleCatalog.map((item) => item.id).filter((id) => selected.has(id))
}

export function getModule(id: WorkspaceModuleId) {
  return moduleCatalog.find((item) => item.id === id)
}
