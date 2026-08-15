import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultEnabledModules, getModule, moduleCatalog } from '../data/moduleCatalog'
import { readStorage, removeStorage, writeStorage } from '../services/storage'
import type { BusinessProfile, WorkspaceConfig, WorkspaceModuleId } from '../types/workspace'

type Theme = 'dark' | 'light'
export type ToastTone = 'default' | 'success' | 'error'
export type Toast = { id: number; message: string; tone?: ToastTone }

export type WorkspaceTask = {
  id: string
  title: string
  description: string
  project: string
  client?: string
  assignee: string
  status: 'Aberta' | 'Em andamento' | 'Revisão' | 'Concluída'
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  due: string
  estimate?: string
  tags: string[]
  createdAt: string
}

export type WorkspaceNotification = {
  id: string
  title: string
  description: string
  time: string
  tone: 'orange' | 'blue' | 'green' | 'neutral'
  read: boolean
  route: string
}

type NewTaskInput = Omit<WorkspaceTask, 'id' | 'createdAt'>

type AppContextValue = {
  theme: Theme
  toggleTheme: () => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  aiOpen: boolean
  setAiOpen: (open: boolean) => void
  toasts: Toast[]
  notify: (message: string, tone?: ToastTone) => void
  tasks: WorkspaceTask[]
  createTask: (task: NewTaskInput) => WorkspaceTask
  updateTask: (id: string, patch: Partial<WorkspaceTask>) => void
  taskComposerOpen: boolean
  openTaskComposer: () => void
  closeTaskComposer: () => void
  notifications: WorkspaceNotification[]
  unreadNotifications: number
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  workspaceConfig: WorkspaceConfig | null
  onboardingCompleted: boolean
  completeOnboarding: (business: BusinessProfile, enabledModules: WorkspaceModuleId[]) => void
  toggleWorkspaceModule: (id: WorkspaceModuleId) => { ok: boolean; message: string }
  resetWorkspace: () => void
}

const AppContext = createContext<AppContextValue | null>(null)
const WORKSPACE_KEY = 'wf-workspace-config-v1'

const initialTasks: WorkspaceTask[] = [
  { id: 'task-1', title: 'Revisar proposta comercial', description: 'Conferir escopo, prazo e condições antes do envio.', project: 'Projeto Horizonte', client: 'Horizonte Arquitetura', assignee: 'Rafael Martins', status: 'Em andamento', priority: 'Alta', due: '2026-07-15', estimate: '1h 30m', tags: ['Comercial'], createdAt: '2026-07-14T09:00:00.000Z' },
  { id: 'task-2', title: 'Aprovar conteúdo da campanha', description: 'Revisar os textos da campanha e aprovar a publicação.', project: 'Campanha Aurora', client: 'Clínica Aurora', assignee: 'Camila Rocha', status: 'Aberta', priority: 'Média', due: '2026-07-15', estimate: '45m', tags: ['Conteúdo'], createdAt: '2026-07-14T10:00:00.000Z' },
  { id: 'task-3', title: 'Preparar pauta da reunião', description: 'Consolidar riscos, decisões pendentes e próximos passos.', project: 'Operação', assignee: 'Rafael Martins', status: 'Aberta', priority: 'Média', due: '2026-07-15', estimate: '30m', tags: ['Reunião'], createdAt: '2026-07-14T11:00:00.000Z' },
  { id: 'task-4', title: 'Validar importação de contatos', description: 'Confirmar campos obrigatórios e mensagens de erro.', project: 'Implantação CRM', assignee: 'Larissa Mendes', status: 'Concluída', priority: 'Baixa', due: '2026-07-16', estimate: '1h', tags: ['Operação'], createdAt: '2026-07-13T09:00:00.000Z' },
]

const initialNotifications: WorkspaceNotification[] = [
  { id: 'notification-1', title: '3 leads sem próxima ação', description: 'Existem oportunidades que precisam de acompanhamento hoje.', time: '5 min atrás', tone: 'orange', read: false, route: '/crm/opportunities' },
  { id: 'notification-2', title: 'Sincronização concluída', description: '39 contatos demonstrativos foram revisados.', time: '12 min atrás', tone: 'blue', read: false, route: '/crm/contacts' },
  { id: 'notification-3', title: 'Workflow normalizado', description: 'A automação voltou a executar sem falhas.', time: '1 hora atrás', tone: 'green', read: true, route: '/automation/workflows' },
  { id: 'notification-4', title: 'Proposta visualizada', description: 'Horizonte Arquitetura abriu a proposta comercial.', time: '2 horas atrás', tone: 'neutral', read: false, route: '/relationships/proposals/proposal-northstar' },
]

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('wf-theme') as Theme | null
  return stored ?? 'dark'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('wf-sidebar') === 'collapsed')
  const [aiOpen, setAiOpen] = useState(false)
  const [taskComposerOpen, setTaskComposerOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => readStorage('wf-tasks-v04', initialTasks))
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(() => readStorage('wf-notifications-v04', initialNotifications))
  const [workspaceConfig, setWorkspaceConfig] = useState<WorkspaceConfig | null>(() => readStorage<WorkspaceConfig | null>(WORKSPACE_KEY, null))

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      localStorage.setItem('wf-theme', next)
      return next
    })
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const next = !current
      localStorage.setItem('wf-sidebar', next ? 'collapsed' : 'expanded')
      return next
    })
  }

  const notify = (message: string, tone: ToastTone = 'default') => {
    const id = Date.now() + Math.random()
    setToasts((items) => [...items, { id, message, tone }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2800)
  }

  const createTask = (task: NewTaskInput) => {
    const created: WorkspaceTask = { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() }
    setTasks((current) => {
      const next = [created, ...current]
      writeStorage('wf-tasks-v04', next)
      return next
    })
    return created
  }

  const updateTask = (id: string, patch: Partial<WorkspaceTask>) => {
    setTasks((current) => {
      const next = current.map((task) => task.id === id ? { ...task, ...patch } : task)
      writeStorage('wf-tasks-v04', next)
      return next
    })
  }

  const storeNotifications = (next: WorkspaceNotification[]) => {
    writeStorage('wf-notifications-v04', next)
    setNotifications(next)
  }

  const markNotificationRead = (id: string) => storeNotifications(notifications.map((item) => item.id === id ? { ...item, read: true } : item))
  const markAllNotificationsRead = () => storeNotifications(notifications.map((item) => ({ ...item, read: true })))
  const clearNotifications = () => storeNotifications([])

  const completeOnboarding = (business: BusinessProfile, enabledModules: WorkspaceModuleId[]) => {
    const required = moduleCatalog.filter((item) => item.required).map((item) => item.id)
    const uniqueModules = moduleCatalog.map((item) => item.id).filter((id) => enabledModules.includes(id) || required.includes(id))
    const now = new Date().toISOString()
    const config: WorkspaceConfig = {
      id: `workspace-${Date.now()}`,
      version: 1,
      onboardingCompleted: true,
      business,
      enabledModules: uniqueModules,
      navigationOrder: uniqueModules,
      dashboardWidgets: ['attention', 'pipeline', 'tasks', 'calendar', 'automation'],
      createdAt: workspaceConfig?.createdAt ?? now,
      updatedAt: now,
    }
    writeStorage(WORKSPACE_KEY, config)
    setWorkspaceConfig(config)
  }

  const toggleWorkspaceModule = (id: WorkspaceModuleId) => {
    const module = getModule(id)
    if (!module) return { ok: false, message: 'Módulo não encontrado.' }
    if (module.required) return { ok: false, message: `${module.label} é obrigatório no workspace.` }
    if (!workspaceConfig) return { ok: false, message: 'Conclua o onboarding primeiro.' }

    const enabled = workspaceConfig.enabledModules.includes(id)
    if (enabled) {
      const dependent = moduleCatalog.find((item) => item.dependencies?.includes(id) && workspaceConfig.enabledModules.includes(item.id))
      if (dependent) return { ok: false, message: `Desative ${dependent.label} antes de remover ${module.label}.` }
    }

    const enabledModules = enabled
      ? workspaceConfig.enabledModules.filter((moduleId) => moduleId !== id)
      : moduleCatalog.map((item) => item.id).filter((moduleId) => workspaceConfig.enabledModules.includes(moduleId) || moduleId === id || module.dependencies?.includes(moduleId))

    const next: WorkspaceConfig = {
      ...workspaceConfig,
      enabledModules,
      navigationOrder: moduleCatalog.map((item) => item.id).filter((moduleId) => enabledModules.includes(moduleId)),
      updatedAt: new Date().toISOString(),
    }
    writeStorage(WORKSPACE_KEY, next)
    setWorkspaceConfig(next)
    return { ok: true, message: `${module.label} ${enabled ? 'removido' : 'ativado'} com sucesso.` }
  }

  const resetWorkspace = () => {
    removeStorage(WORKSPACE_KEY)
    setWorkspaceConfig(null)
  }

  const value = useMemo(() => ({
    theme, toggleTheme, sidebarCollapsed, toggleSidebar, aiOpen, setAiOpen, toasts, notify,
    tasks, createTask, updateTask, taskComposerOpen, openTaskComposer: () => setTaskComposerOpen(true), closeTaskComposer: () => setTaskComposerOpen(false),
    notifications, unreadNotifications: notifications.filter((item) => !item.read).length, markNotificationRead, markAllNotificationsRead, clearNotifications,
    workspaceConfig, onboardingCompleted: Boolean(workspaceConfig?.onboardingCompleted), completeOnboarding, toggleWorkspaceModule, resetWorkspace,
  }), [theme, sidebarCollapsed, aiOpen, toasts, tasks, taskComposerOpen, notifications, workspaceConfig])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}

export { defaultEnabledModules }
