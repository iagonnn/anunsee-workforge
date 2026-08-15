import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import type { WorkspaceConfig } from './types/workspace'

const demoWorkspace: WorkspaceConfig = {
  id: 'workspace-test', version: 1, onboardingCompleted: true,
  business: {
    id: 'business-test', name: 'Empresa Teste', industry: 'Consultoria', city: 'São Paulo', state: 'SP',
    teamSize: '2–5 pessoas', clientVolume: '1–10', operatingModels: ['Projetos'],
    acquisitionChannels: ['Indicação'], communicationChannels: ['WhatsApp'], needs: ['Organizar contatos', 'Organizar tarefas'],
  },
  enabledModules: ['dashboard', 'conversations', 'contacts', 'companies', 'opportunities', 'calendar', 'automations', 'marketing', 'sites', 'reputation', 'projects', 'tasks', 'reports', 'team', 'integrations', 'settings'],
  navigationOrder: ['dashboard', 'conversations', 'contacts', 'companies', 'opportunities', 'calendar', 'automations', 'marketing', 'sites', 'reputation', 'projects', 'tasks', 'reports', 'team', 'integrations', 'settings'],
  dashboardWidgets: ['attention', 'pipeline', 'tasks'], createdAt: '2026-07-15T12:00:00.000Z', updatedAt: '2026-07-15T12:00:00.000Z',
}

const canonicalRoutes: Array<[string, RegExp]> = [
  ['/login', /Bem-vindo de volta/i],
  ['/signup', /Crie sua conta/i],
  ['/2fa', /Proteja sua conta/i],
  ['/dashboard', /O que move a agência hoje/i],
  ['/conversations', /^Conversas$/i],
  ['/crm/contacts', /^Contatos$/i],
  ['/crm/companies', /^Empresas$/i],
  ['/crm/opportunities', /^Pipeline$/i],
  ['/calendar', /^Calendário$/i],
  ['/execution/projects', /Portfólio da agência/i],
  ['/execution/tasks', /^Tarefas$/i],
  ['/automation/approvals', /Central de decisões/i],
  ['/relationships/clients-legacy', /Contas e projetos/i],
  ['/portal/lucy-services', /Seu projeto, sem ruído/i],
  ['/automation/workflows', /^Automações$/i],
  ['/marketing', /^Marketing$/i],
  ['/sites', /Sites e formulários/i],
  ['/reputation', /^Reputação$/i],
  ['/settings/modules', /Módulos do workspace/i],
  ['/settings/workspace', /^Workspace$/i],
]

function seedWorkspace(config = demoWorkspace) {
  localStorage.setItem('wf-workspace-config-v1', JSON.stringify(config))
}

function renderRoute(route: string, configured = !['/login', '/signup', '/2fa', '/onboarding'].includes(route)) {
  if (configured) seedWorkspace()
  return render(<MemoryRouter initialEntries={[route]}><AppProvider><App /></AppProvider></MemoryRouter>)
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
})

describe('WorkForge routes', () => {
  for (const [route, heading] of canonicalRoutes) {
    it(`renders ${route}`, () => {
      renderRoute(route)
      expect(screen.getByRole('heading', { name: heading, level: 1 })).toBeInTheDocument()
    })
  }
})

describe('onboarding and workspace configuration', () => {
  it('redirects protected routes to onboarding when workspace is not configured', () => {
    renderRoute('/dashboard', false)
    expect(screen.getByRole('heading', { name: 'Sua empresa', level: 2 })).toBeInTheDocument()
  })

  it('completes onboarding and persists the workspace', () => {
    renderRoute('/onboarding', false)
    fireEvent.change(screen.getByPlaceholderText('Ex.: NovaVia Consultoria'), { target: { value: 'NovaVia Teste' } })
    fireEvent.change(screen.getByLabelText(/Segmento/i), { target: { value: 'Consultoria' } })
    fireEvent.change(screen.getByPlaceholderText('São Paulo'), { target: { value: 'Campinas' } })
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'SP' } })
    fireEvent.change(screen.getByLabelText(/Tamanho da equipe/i), { target: { value: '2–5 pessoas' } })
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Projetos' }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Indicação' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'WhatsApp' })[1])
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Organizar contatos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Organizar tarefas' }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Criar meu workspace/i }))
    expect(screen.getByRole('heading', { name: /O que move a agência hoje/i, level: 1 })).toBeInTheDocument()
    expect(localStorage.getItem('wf-workspace-config-v1')).toContain('NovaVia Teste')
  })


  it('allows using a basic workspace without completing the form', () => {
    renderRoute('/onboarding', false)
    fireEvent.click(screen.getByRole('button', { name: /Usar sistema básico/i }))
    expect(screen.getByRole('heading', { name: /O que move a agência hoje/i, level: 1 })).toBeInTheDocument()
    expect(localStorage.getItem('wf-workspace-config-v1')).toContain('Minha empresa')
  })

  it('exits onboarding and returns to login', () => {
    localStorage.setItem('wf-demo-user', 'demo@workforge.app')
    renderRoute('/onboarding', false)
    fireEvent.click(screen.getByRole('button', { name: /^Sair$/i }))
    expect(screen.getByRole('heading', { name: /Bem-vindo de volta/i, level: 1 })).toBeInTheDocument()
    expect(localStorage.getItem('wf-demo-user')).toBeNull()
  })

  it('removes an optional module from the focused sidebar', () => {
    renderRoute('/settings/modules')
    expect(screen.getByRole('link', { name: /Automações/i })).toBeInTheDocument()
    const automationsCard = screen.getByRole('heading', { name: 'Automações', level: 3 }).closest('section')
    const toggle = automationsCard?.querySelector('button')
    expect(toggle).toBeTruthy()
    fireEvent.click(toggle!)
    expect(screen.queryByRole('link', { name: /Automações/i })).not.toBeInTheDocument()
  })
})

describe('core interactions', () => {
  it('persists theme and sidebar preferences', () => {
    const { container } = renderRoute('/dashboard')
    fireEvent.click(screen.getByRole('button', { name: /alternar tema/i }))
    expect(localStorage.getItem('wf-theme')).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: /recolher sidebar/i }))
    expect(localStorage.getItem('wf-sidebar')).toBe('collapsed')
    expect(container.querySelector('.app-frame')).toHaveClass('app-frame--collapsed')
  })

  it('creates and persists a contact', () => {
    renderRoute('/crm/contacts')
    fireEvent.click(screen.getByRole('button', { name: /Novo contato/i }))
    fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'Contato Teste' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar contato' }))
    expect(screen.getByRole('dialog', { name: 'Contato Teste' })).toBeInTheDocument()
    expect(localStorage.getItem('wf-contacts-v1')).toContain('Contato Teste')
  })

  it('sends and persists a local conversation message', () => {
    renderRoute('/conversations')
    fireEvent.change(screen.getByPlaceholderText(/Responder a/i), { target: { value: 'Mensagem de acompanhamento' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByText('Mensagem de acompanhamento', { selector: 'p' })).toBeInTheDocument()
    expect(localStorage.getItem('wf-conversations-v1')).toContain('Mensagem de acompanhamento')
  })

  it('creates a task through the task form and persists it', () => {
    renderRoute('/execution/tasks')
    fireEvent.click(screen.getByRole('button', { name: 'Nova tarefa' }))
    fireEvent.change(screen.getByPlaceholderText('O que precisa ser feito?'), { target: { value: 'Testar formulário funcional' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }))
    expect(screen.getByText('Testar formulário funcional')).toBeInTheDocument()
    expect(localStorage.getItem('wf-tasks-v04')).toContain('Testar formulário funcional')
  })

  it('moves from login to onboarding when the account is not configured', async () => {
    vi.useFakeTimers()
    renderRoute('/login', false)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await act(async () => { await vi.advanceTimersByTimeAsync(700) })
    expect(screen.getByRole('heading', { name: 'Sua empresa', level: 2 })).toBeInTheDocument()
  })

  it('moves from login to dashboard when the workspace exists', async () => {
    vi.useFakeTimers()
    seedWorkspace()
    renderRoute('/login', false)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await act(async () => { await vi.advanceTimersByTimeAsync(700) })
    expect(screen.getByRole('heading', { name: /O que move a agência hoje/i, level: 1 })).toBeInTheDocument()
  })

  it('switches from agency mode to the client portal and back', () => {
    renderRoute('/dashboard')
    fireEvent.click(screen.getByRole('button', { name: /Ver portal do cliente/i }))
    expect(screen.getByRole('heading', { name: /Seu projeto, sem ruído/i, level: 1 })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Modo agência/i }))
    expect(screen.getByRole('heading', { name: /O que move a agência hoje/i, level: 1 })).toBeInTheDocument()
  })

  it('records a client approval in the portal demo', () => {
    renderRoute('/portal/lucy-services/approvals')
    fireEvent.click(screen.getByRole('button', { name: /Aprovar entrega/i }))
    expect(screen.getByText('Decisão registrada')).toBeInTheDocument()
  })

  it('adds a message to the client conversation', () => {
    renderRoute('/portal/lucy-services/messages')
    fireEvent.change(screen.getByPlaceholderText(/Escreva uma mensagem para a equipe/i), { target: { value: 'Mensagem enviada pelo portal' } })
    fireEvent.click(screen.getByRole('button', { name: /^Enviar$/i }))
    expect(screen.getByText('Mensagem enviada pelo portal', { selector: 'p' })).toBeInTheDocument()
  })
})
