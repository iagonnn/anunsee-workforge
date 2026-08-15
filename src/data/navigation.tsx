import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck, Building2, CalendarDays, ContactRound, FileSignature, FolderKanban,
  Gauge, Inbox, ListChecks, MessageSquareMore, Settings2, UserRound, Workflow,
} from 'lucide-react'
import type { WorkspaceModuleId } from '../types/workspace'

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  route: string
  module?: WorkspaceModuleId
}

export type NavGroup = { label: string; items: NavItem[] }

const navigation: NavGroup[] = [
  {
    label: '',
    items: [
      { id: 'dashboard', label: 'Central', icon: Gauge, route: '/dashboard', module: 'dashboard' },
    ],
  },
  {
    label: 'Operação',
    items: [
      { id: 'projects', label: 'Projetos', icon: FolderKanban, route: '/execution/projects', module: 'projects' },
      { id: 'tasks', label: 'Tarefas', icon: ListChecks, route: '/execution/tasks', module: 'tasks' },
      { id: 'approvals', label: 'Aprovações', icon: BadgeCheck, route: '/automation/approvals', module: 'projects' },
      { id: 'calendar', label: 'Calendário', icon: CalendarDays, route: '/calendar', module: 'calendar' },
    ],
  },
  {
    label: 'Clientes',
    items: [
      { id: 'clients', label: 'Contas', icon: Building2, route: '/relationships/clients-legacy', module: 'companies' },
      { id: 'conversations', label: 'Conversas', icon: MessageSquareMore, route: '/conversations', module: 'conversations' },
      { id: 'proposals', label: 'Propostas', icon: FileSignature, route: '/relationships/proposals', module: 'companies' },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { id: 'pipeline', label: 'Pipeline', icon: Inbox, route: '/crm/opportunities', module: 'opportunities' },
      { id: 'contacts', label: 'Contatos', icon: ContactRound, route: '/crm/contacts', module: 'contacts' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { id: 'automations', label: 'Automações', icon: Workflow, route: '/automation/workflows', module: 'automations' },
      { id: 'settings', label: 'Configurações', icon: Settings2, route: '/settings/workspace', module: 'settings' },
    ],
  },
]

export function buildNavigation(enabledModules?: WorkspaceModuleId[]): NavGroup[] {
  if (!enabledModules) return navigation
  const enabled = new Set(enabledModules)
  return navigation.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.module || enabled.has(item.module)),
  })).filter((group) => group.items.length > 0)
}

export function flattenNavigation(groups: NavGroup[]) {
  return groups.flatMap((group) => group.items)
}

export const profileItem: NavItem = { id: 'profile', label: 'Perfil', icon: UserRound, route: '/profile' }
