import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Bot, ChevronDown, ChevronLeft, ChevronRight, Command, Eye, Moon,
  Plus, Search, Send, Settings2, Sun, X, CheckCheck, Trash2, CircleAlert,
  RefreshCw, CircleCheck, Inbox, CheckSquare2, CalendarPlus, FolderPlus,
} from 'lucide-react'
import { buildNavigation, flattenNavigation } from '../data/navigation'
import { useApp, type WorkspaceNotification } from '../context/AppContext'
import { Avatar, Badge, Button } from './ui'
import { TaskComposer } from './TaskComposer'

const notificationIcons = {
  orange: CircleAlert,
  blue: RefreshCw,
  green: CircleCheck,
  neutral: Inbox,
}

export function AppShell({ children }: { children: ReactNode }) {
  const {
    theme, toggleTheme, sidebarCollapsed, toggleSidebar, aiOpen, setAiOpen, toasts, notify,
    openTaskComposer, notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead, clearNotifications, workspaceConfig,
  } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [groupState, setGroupState] = useState<Record<string, boolean>>({})
  const notificationRef = useRef<HTMLDivElement>(null)
  const navGroups = useMemo(() => buildNavigation(workspaceConfig?.enabledModules), [workspaceConfig?.enabledModules])
  const allNavItems = useMemo(() => flattenNavigation(navGroups), [navGroups])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key.toLowerCase() === 'n' && !event.ctrlKey && !event.metaKey && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault()
        openTaskComposer()
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setProfileOpen(false)
        setNotificationsOpen(false)
        setCreateOpen(false)
        setAiOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openTaskComposer, setAiOpen])

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setNotificationsOpen(false)
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [])

  const results = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return allNavItems.slice(0, 10)
    return allNavItems.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 12)
  }, [search, allNavItems])

  const currentLabel = useMemo(() => {
    const matches = allNavItems.filter((item) => location.pathname === item.route || location.pathname.startsWith(`${item.route}/`))
    return matches.sort((a, b) => b.route.length - a.route.length)[0]?.label ?? 'Workspace'
  }, [location.pathname, allNavItems])

  const goToResult = (route: string) => {
    navigate(route)
    setSearchOpen(false)
    setSearch('')
  }

  const openNotification = (item: WorkspaceNotification) => {
    markNotificationRead(item.id)
    setNotificationsOpen(false)
    navigate(item.route)
  }

  const createOptions = [
    { label: 'Nova tarefa', description: 'Crie e atribua trabalho', icon: CheckSquare2, action: () => openTaskComposer() },
    { label: 'Novo projeto', description: 'Inicie um projeto', icon: FolderPlus, action: () => navigate('/execution/projects?create=1') },
    { label: 'Nova reunião', description: 'Agende um evento', icon: CalendarPlus, action: () => navigate('/execution/meetings?create=1') },
  ]

  return (
    <div className={`app-frame ${sidebarCollapsed ? 'app-frame--collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar__brand-row agency-brand-row">
          <button className="agency-brand" onClick={() => navigate('/dashboard')} aria-label="Abrir central da ANUNSEE">
            <span className="agency-brand__mark">A</span>
            <span className="agency-brand__copy"><strong>ANUNSEE</strong><small>WorkForge</small></span>
          </button>
          <button className="icon-button icon-button--quiet sidebar__collapse" onClick={toggleSidebar} aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}>
            {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        <div className="sidebar-create-wrap">
          <button className="sidebar-create" onClick={() => setCreateOpen((current) => !current)} aria-expanded={createOpen}>
            <Plus size={16} /><span>Novo</span><kbd>N</kbd>
          </button>
          {createOpen ? (
            <div className="popover create-popover">
              {createOptions.map(({ label, description, icon: Icon, action }) => (
                <button key={label} onClick={() => { action(); setCreateOpen(false) }}>
                  <Icon size={16} /><span><strong>{label}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <nav className="sidebar__nav" aria-label="Navegação principal">
          {navGroups.map((group) => {
            const collapsed = group.label ? groupState[group.label] === false : false
            return (
              <div className="nav-group" key={group.label || 'root'}>
                {group.label ? (
                  <div className="nav-group__heading">
                    <button className="nav-group__title" onClick={() => setGroupState((current) => ({ ...current, [group.label]: collapsed }))}>
                      <span>{group.label}</span><ChevronDown size={13} className={collapsed ? 'rotate--closed' : ''} />
                    </button>
                  </div>
                ) : null}
                <div className={`nav-group__items ${collapsed ? 'nav-group__items--closed' : ''}`}>
                  {group.items.map(({ id, label, icon: Icon, route }) => (
                    <NavLink key={id} to={route} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`} title={sidebarCollapsed ? label : undefined}>
                      <Icon size={17} strokeWidth={1.7} /><span>{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <button className="profile-chip" onClick={() => navigate('/profile')}>
            <Avatar name="Iago" size="sm" />
            <span className="profile-chip__copy"><strong>Iago</strong><small>Administrador · Agência</small></span>
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="topbar__context">
            <button className="workspace-switcher" onClick={() => navigate('/settings/workspace')}>
              <span className="workspace-switcher__dot" /><span>{workspaceConfig?.business.name === 'Minha empresa' ? 'ANUNSEE' : workspaceConfig?.business.name ?? 'ANUNSEE'}</span><Badge tone="neutral">AGÊNCIA</Badge><ChevronDown size={14} />
            </button>
            <ChevronRight size={13} /><span>{currentLabel}</span>
          </div>
          <div className="topbar__actions">
            <button className="client-preview-trigger" onClick={() => navigate('/portal/lucy-services')}><Eye size={15} /><span>Ver portal do cliente</span></button>
            <button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={16} /><span>Buscar no workspace</span><kbd><Command size={11} /> K</kbd></button>
            <button className="icon-button" onClick={toggleTheme} aria-label="Alternar tema">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
            <div className="notification-wrap" ref={notificationRef}>
              <button className={`icon-button notification-button ${notificationsOpen ? 'icon-button--active' : ''}`} onClick={() => setNotificationsOpen((current) => !current)} aria-label="Notificações" aria-expanded={notificationsOpen}>
                <Bell size={17} />{unreadNotifications ? <span>{unreadNotifications}</span> : null}
              </button>
              {notificationsOpen ? (
                <section className="notification-panel" aria-label="Central de notificações">
                  <header><div><h2>Notificações</h2><small>{unreadNotifications} não lidas</small></div><div><button onClick={markAllNotificationsRead} title="Marcar todas como lidas"><CheckCheck size={16} /></button><button onClick={clearNotifications} title="Limpar notificações"><Trash2 size={16} /></button></div></header>
                  <div className="notification-list">
                    {notifications.length ? notifications.map((item) => {
                      const Icon = notificationIcons[item.tone]
                      return (
                        <button className={`notification-item notification-item--${item.tone} ${!item.read ? 'notification-item--unread' : ''}`} key={item.id} onClick={() => openNotification(item)}>
                          <span className="notification-item__icon"><Icon size={16} /></span>
                          <span><strong>{item.title}{!item.read ? <i /> : null}</strong><small>{item.description}</small><time>{item.time}</time></span>
                          <ChevronRight size={14} />
                        </button>
                      )
                    }) : <div className="notification-empty"><Bell size={20} /><strong>Tudo em dia</strong><p>Não há notificações neste momento.</p></div>}
                  </div>
                  {notifications.length ? <footer><button onClick={markAllNotificationsRead}>Marcar todas como lidas</button></footer> : null}
                </section>
              ) : null}
            </div>
            <div className="profile-menu-wrap">
              <button className="avatar-button" onClick={() => setProfileOpen((current) => !current)} aria-label="Abrir menu do perfil"><Avatar name="Iago" size="sm" /></button>
              {profileOpen ? (
                <div className="popover profile-popover">
                  <div className="profile-popover__header"><Avatar name="Iago" /><span><strong>Iago</strong><small>Administrador da ANUNSEE</small></span></div>
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false) }}>Ver perfil</button>
                  <button onClick={() => { navigate('/settings/modules'); setProfileOpen(false) }}><Settings2 size={15} /> Preferências</button>
                  <button onClick={() => navigate('/login')}>Sair</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="workspace__content"><div className="route-stage" key={location.pathname}>{children}</div></main>
      </section>

      <button className="ai-fab" onClick={() => setAiOpen(true)} aria-label="Abrir assistente de IA"><Bot size={20} /></button>
      <div className={`drawer-backdrop ${aiOpen ? 'drawer-backdrop--visible' : ''}`} onClick={() => setAiOpen(false)} />
      <aside className={`ai-drawer ${aiOpen ? 'ai-drawer--open' : ''}`} aria-hidden={!aiOpen}>
        <div className="ai-drawer__header"><div><span className="eyebrow">WorkForge AI</span><h2>Pergunte ao workspace</h2></div><button className="icon-button" onClick={() => setAiOpen(false)}><X size={17} /></button></div>
        <div className="ai-drawer__body">
          <div className="ai-message ai-message--assistant"><div className="ai-message__icon"><Bot size={16} /></div><div><strong>Em que posso ajudar?</strong><p>Posso resumir projetos, encontrar bloqueios, preparar uma atualização para o cliente ou transformar decisões em tarefas.</p></div></div>
          <div className="suggestion-grid">{['Resumir projetos ativos', 'Encontrar bloqueios', 'Preparar atualização', 'Criar próximos passos'].map((suggestion) => <button key={suggestion} onClick={() => notify(`${suggestion}: análise simulada preparada.`, 'success')}>{suggestion}</button>)}</div>
        </div>
        <div className="ai-composer"><textarea rows={3} placeholder="Pergunte sobre projetos, tarefas, clientes ou automações..." /><Button variant="primary" onClick={() => notify('Pergunta enviada para a simulação de IA.', 'success')}><Send size={15} /> Enviar</Button></div>
      </aside>

      {searchOpen ? (
        <div className="modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setSearchOpen(false)}>
          <div className="command-palette" role="dialog" aria-modal="true">
            <div className="command-palette__input"><Search size={18} /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busque páginas, clientes, projetos e ferramentas..." /><kbd>Esc</kbd></div>
            <div className="command-palette__results"><span className="eyebrow">Navegação</span>{results.map(({ id, label, icon: Icon, route }) => <button key={id} onClick={() => goToResult(route)}><Icon size={17} /><span>{label}</span><small>Abrir</small></button>)}</div>
          </div>
        </div>
      ) : null}

      <TaskComposer />
      <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div className={`toast toast--${toast.tone ?? 'default'}`} key={toast.id}>{toast.message}</div>)}</div>
    </div>
  )
}
