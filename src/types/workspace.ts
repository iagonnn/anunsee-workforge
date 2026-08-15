export type BusinessProfile = {
  id: string
  name: string
  industry: string
  city: string
  state: string
  website?: string
  teamSize: string
  clientVolume: string
  operatingModels: string[]
  acquisitionChannels: string[]
  communicationChannels: string[]
  needs: string[]
}

export type WorkspaceModuleStatus = 'functional' | 'simulated' | 'coming-soon'

export type WorkspaceModuleId =
  | 'dashboard'
  | 'conversations'
  | 'contacts'
  | 'companies'
  | 'opportunities'
  | 'calendar'
  | 'automations'
  | 'marketing'
  | 'sites'
  | 'reputation'
  | 'projects'
  | 'tasks'
  | 'reports'
  | 'team'
  | 'integrations'
  | 'settings'

export type WorkspaceConfig = {
  id: string
  version: number
  onboardingCompleted: boolean
  business: BusinessProfile
  enabledModules: WorkspaceModuleId[]
  navigationOrder: WorkspaceModuleId[]
  dashboardWidgets: string[]
  createdAt: string
  updatedAt: string
}

export type OnboardingDraft = Omit<BusinessProfile, 'id'>
