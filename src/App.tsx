import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { useApp } from './context/AppContext'
import { CalendarPage, KanbanPage, MeetingsPage, TasksPage, TimelinePage } from './pages/WorkPages'
import { LoginPage, SignupPage, TwoFactorPage } from './pages/AuthPages'
import { ModulePage } from './pages/ModulePage'
import { ProfilePage } from './pages/ProfilePage'
import { CodeStudioPage, ImageEditorPage, SiteEditorPage } from './pages/StudioPages'
import { AutomationsPage } from './pages/AutomationsPage'
import { GroupOverviewPage } from './pages/OverviewPages'
import { ClientDetailPage, ClientsPage, PipelinePage, PortalsPage, ProposalDetailPage, ProposalsPage } from './pages/RelationshipsPages'
import { GoalsPage, IdeasPage } from './pages/StrategyPages'
import { OnboardingPage } from './pages/OnboardingPage'
import { CompaniesPage, ContactsPage, ConversationsPage } from './pages/CrmPages'
import { MarketingPage, ReputationPage, SitesPage } from './pages/GrowthPages'
import { ModulesSettingsPage, WorkspaceSettingsPage } from './pages/SettingsPages'
import {
  AgencyDashboardPage, ApprovalCenterPage, ClientsWorkspacePage,
  ProjectsWorkspacePage, ProjectWorkspaceDetailPage,
} from './pages/AgencyWorkspacePages'
import {
  ClientPortalApprovalsPage, ClientPortalFilesPage, ClientPortalHomePage,
  ClientPortalMessagesPage, ClientPortalProjectPage, ClientPortalShell,
} from './pages/ClientPortalPages'

function ProtectedLayout() {
  const { onboardingCompleted } = useApp()
  const location = useLocation()
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />
  return <AppShell><Outlet /></AppShell>
}

function ProtectedPortalLayout() {
  const { onboardingCompleted } = useApp()
  const location = useLocation()
  if (!onboardingCompleted) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <ClientPortalShell />
}

const aliases: Array<[string, string]> = [
  ['/projects', '/execution/projects'], ['/tasks', '/execution/tasks'], ['/kanban', '/kanban'], ['/timeline', '/execution/timeline'],
  ['/clients', '/crm/companies'], ['/pipeline', '/crm/opportunities'], ['/proposals', '/relationships/proposals'], ['/meetings', '/execution/meetings'],
  ['/ideas', '/strategy/ideas'], ['/goals', '/strategy/goals'], ['/processes', '/knowledge/processes'], ['/content', '/marketing'], ['/finance', '/admin/finance'],
  ['/automations', '/automation/workflows'], ['/approvals', '/automation/approvals'], ['/automation-runs', '/automation/runs'], ['/ai-workspace', '/automation/assistant'],
  ['/files', '/knowledge/files'], ['/templates', '/knowledge/templates'], ['/insights', '/strategy/insights'], ['/team', '/settings/team'],
  ['/members', '/settings/team'], ['/integrations', '/settings/integrations'], ['/workspace', '/settings/workspace'], ['/security', '/settings/security'], ['/preferences', '/settings/modules'],
  ['/client-portal', '/portal/lucy-services'], ['/code-studio', '/automation/code-studio'],
  ['/relationships/pipeline', '/crm/opportunities'], ['/relationships/clients', '/crm/companies'], ['/strategy/reports', '/reports'],
  ['/admin/workspace', '/settings/workspace'], ['/admin/integrations', '/settings/integrations'], ['/admin/security', '/settings/security'], ['/admin/preferences', '/settings/modules'],
]

const legacyModules = ['my-work', 'time', 'ai-generate', 'ai-summarize', 'ai-proposal', 'ai-report', 'ai-risks', 'ai-activity', 'import-trello', 'import-asana', 'import-csv', 'export-data', 'billing', 'help']

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/2fa" element={<TwoFactorPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<ProtectedPortalLayout />}>
        <Route path="/portal/:clientId" element={<ClientPortalHomePage />} />
        <Route path="/portal/:clientId/project/:projectId" element={<ClientPortalProjectPage />} />
        <Route path="/portal/:clientId/approvals" element={<ClientPortalApprovalsPage />} />
        <Route path="/portal/:clientId/files" element={<ClientPortalFilesPage />} />
        <Route path="/portal/:clientId/messages" element={<ClientPortalMessagesPage />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<AgencyDashboardPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/crm/contacts" element={<ContactsPage />} />
        <Route path="/crm/companies" element={<CompaniesPage />} />
        <Route path="/crm/opportunities" element={<PipelinePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/my-work" element={<ModulePage id="my-work" />} />
        <Route path="/kanban" element={<KanbanPage />} />

        <Route path="/relationships" element={<GroupOverviewPage type="relationships" />} />
        <Route path="/relationships/clients/:clientId" element={<ClientDetailPage />} />
        <Route path="/relationships/proposals" element={<ProposalsPage />} />
        <Route path="/relationships/proposals/:proposalId" element={<ProposalDetailPage />} />
        <Route path="/relationships/portals" element={<PortalsPage />} />
        <Route path="/relationships/clients-legacy" element={<ClientsWorkspacePage />} />

        <Route path="/execution" element={<GroupOverviewPage type="execution" />} />
        <Route path="/execution/projects" element={<ProjectsWorkspacePage />} />
        <Route path="/execution/projects/:projectId" element={<ProjectWorkspaceDetailPage />} />
        <Route path="/execution/tasks" element={<TasksPage />} />
        <Route path="/execution/meetings" element={<MeetingsPage />} />
        <Route path="/execution/timeline" element={<TimelinePage />} />
        <Route path="/execution/team" element={<ModulePage id="team" />} />

        <Route path="/strategy" element={<GroupOverviewPage type="strategy" />} />
        <Route path="/strategy/goals" element={<GoalsPage />} />
        <Route path="/strategy/ideas" element={<IdeasPage />} />
        <Route path="/strategy/insights" element={<ModulePage id="insights" />} />

        <Route path="/automation" element={<GroupOverviewPage type="automation" />} />
        <Route path="/automation/workflows" element={<AutomationsPage />} />
        <Route path="/automation/approvals" element={<ApprovalCenterPage />} />
        <Route path="/automation/runs" element={<ModulePage id="automation-runs" />} />
        <Route path="/automation/assistant" element={<ModulePage id="ai-workspace" />} />
        <Route path="/automation/code-studio" element={<CodeStudioPage />} />

        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/reputation" element={<ReputationPage />} />
        <Route path="/reports" element={<ModulePage id="reports" />} />

        <Route path="/knowledge" element={<GroupOverviewPage type="knowledge" />} />
        <Route path="/knowledge/files" element={<ModulePage id="files" />} />
        <Route path="/knowledge/processes" element={<ModulePage id="processes" />} />
        <Route path="/knowledge/templates" element={<ModulePage id="templates" />} />
        <Route path="/knowledge/content" element={<ModulePage id="content" />} />

        <Route path="/settings/modules" element={<ModulesSettingsPage />} />
        <Route path="/settings/workspace" element={<WorkspaceSettingsPage />} />
        <Route path="/settings/team" element={<ModulePage id="members" />} />
        <Route path="/settings/integrations" element={<ModulePage id="integrations" />} />
        <Route path="/settings/security" element={<ModulePage id="security" />} />

        <Route path="/admin" element={<GroupOverviewPage type="admin" />} />
        <Route path="/admin/members" element={<ModulePage id="members" />} />
        <Route path="/admin/finance" element={<ModulePage id="finance" />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/site-editor" element={<SiteEditorPage />} />
        <Route path="/image-editor" element={<ImageEditorPage />} />
        {legacyModules.map((id) => <Route key={id} path={`/${id}`} element={<ModulePage id={id} />} />)}
        {aliases.filter(([from, to]) => from !== to).map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
