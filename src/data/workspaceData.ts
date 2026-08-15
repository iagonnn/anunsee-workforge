export type ProjectHealth = 'Saudável' | 'Atenção' | 'Em risco'
export type ProjectPhase = 'Descoberta' | 'Planejamento' | 'Produção' | 'Validação' | 'Publicado'

export type ProjectStage = {
  label: string
  status: 'done' | 'current' | 'next'
}

export type AgencyProject = {
  id: string
  name: string
  client: string
  clientId: string
  summary: string
  phase: ProjectPhase
  health: ProjectHealth
  progress: number
  due: string
  owner: string
  ownerInitials: string
  accent: 'lime' | 'violet' | 'blue' | 'orange'
  openTasks: number
  nextMilestone: string
  nextMilestoneDate: string
  waitingForClient: boolean
  portalEnabled: boolean
  stages: ProjectStage[]
}

export type ClientAccount = {
  id: string
  name: string
  initials: string
  segment: string
  location: string
  health: ProjectHealth
  projects: number
  activeSince: string
  lastUpdate: string
  portalEnabled: boolean
  contact: string
}

export type ApprovalItem = {
  id: string
  projectId: string
  project: string
  client: string
  clientId: string
  title: string
  type: string
  requestedAt: string
  due: string
  status: 'Aguardando' | 'Aprovado' | 'Alterações solicitadas'
  version: string
  description: string
  previewLabel: string
}

const defaultStages = (current: ProjectPhase): ProjectStage[] => {
  const phases: ProjectPhase[] = ['Descoberta', 'Planejamento', 'Produção', 'Validação', 'Publicado']
  const currentIndex = phases.indexOf(current)
  return phases.map((label, index) => ({
    label,
    status: index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'next',
  }))
}

export const agencyProjects: AgencyProject[] = [
  {
    id: 'lucy-acquisition',
    name: 'Sistema de aquisição local',
    client: 'Lucy Services Clean',
    clientId: 'lucy-services',
    summary: 'Site, mídia paga e acompanhamento comercial conectados em uma única operação.',
    phase: 'Validação',
    health: 'Saudável',
    progress: 74,
    due: '21 ago',
    owner: 'Iago',
    ownerInitials: 'IA',
    accent: 'lime',
    openTasks: 6,
    nextMilestone: 'Revisão final da campanha',
    nextMilestoneDate: '18 ago · 14:00',
    waitingForClient: true,
    portalEnabled: true,
    stages: defaultStages('Validação'),
  },
  {
    id: 'rr-cro',
    name: 'Otimização de conversão',
    client: 'R&R Brothers',
    clientId: 'rr-brothers',
    summary: 'Revisão do formulário, jornada do lead e pontos de confiança da página.',
    phase: 'Produção',
    health: 'Atenção',
    progress: 58,
    due: '27 ago',
    owner: 'Iago',
    ownerInitials: 'IA',
    accent: 'violet',
    openTasks: 9,
    nextMilestone: 'Nova versão do formulário',
    nextMilestoneDate: '20 ago · 11:30',
    waitingForClient: false,
    portalEnabled: true,
    stages: defaultStages('Produção'),
  },
  {
    id: 'hb-demo',
    name: 'E-commerce demonstrativo',
    client: 'HB Outlet',
    clientId: 'hb-outlet',
    summary: 'Demonstração comercial com catálogo, produto e narrativa visual adaptada ao lead.',
    phase: 'Produção',
    health: 'Saudável',
    progress: 43,
    due: '29 ago',
    owner: 'Luigi',
    ownerInitials: 'LU',
    accent: 'blue',
    openTasks: 11,
    nextMilestone: 'Inserção das imagens finais',
    nextMilestoneDate: '22 ago · 16:00',
    waitingForClient: false,
    portalEnabled: false,
    stages: defaultStages('Produção'),
  },
  {
    id: 'workforge-v06',
    name: 'WorkForge v0.6',
    client: 'ANUNSEE',
    clientId: 'anunsee',
    summary: 'Sistema interno de projetos com uma experiência separada para cada cliente.',
    phase: 'Planejamento',
    health: 'Saudável',
    progress: 31,
    due: '05 set',
    owner: 'Iago',
    ownerInitials: 'IA',
    accent: 'orange',
    openTasks: 14,
    nextMilestone: 'Primeiro checkpoint publicado',
    nextMilestoneDate: '15 ago · hoje',
    waitingForClient: false,
    portalEnabled: false,
    stages: defaultStages('Planejamento'),
  },
]

export const clientAccounts: ClientAccount[] = [
  {
    id: 'lucy-services', name: 'Lucy Services Clean', initials: 'LS', segment: 'Limpeza residencial',
    location: 'Charleston, SC', health: 'Saudável', projects: 1, activeSince: '2026',
    lastUpdate: 'Hoje, 09:42', portalEnabled: true, contact: 'Lucy',
  },
  {
    id: 'rr-brothers', name: 'R&R Brothers', initials: 'RR', segment: 'Flooring & Tile',
    location: 'Charleston, SC', health: 'Atenção', projects: 1, activeSince: '2026',
    lastUpdate: 'Ontem, 16:20', portalEnabled: true, contact: 'Equipe R&R',
  },
  {
    id: 'hb-outlet', name: 'HB Outlet', initials: 'HB', segment: 'Sneakers e streetwear',
    location: 'São Paulo, SP', health: 'Saudável', projects: 1, activeSince: 'Lead',
    lastUpdate: '13 ago, 18:05', portalEnabled: false, contact: 'Contato comercial',
  },
]

export const approvalSeed: ApprovalItem[] = [
  {
    id: 'approval-lucy-campaign', projectId: 'lucy-acquisition', project: 'Sistema de aquisição local',
    client: 'Lucy Services Clean', clientId: 'lucy-services', title: 'Campanha de pesquisa', type: 'Mídia paga',
    requestedAt: 'Hoje, 09:42', due: '18 ago', status: 'Aguardando', version: 'V2',
    description: 'Estrutura de campanha, grupos de anúncios e mensagens preparados para a revisão do cliente.',
    previewLabel: 'Plano de campanha · Agosto 2026',
  },
  {
    id: 'approval-rr-form', projectId: 'rr-cro', project: 'Otimização de conversão',
    client: 'R&R Brothers', clientId: 'rr-brothers', title: 'Formulário enxuto', type: 'Página e CRO',
    requestedAt: 'Ontem, 16:20', due: '20 ago', status: 'Aguardando', version: 'V1',
    description: 'Nova hipótese de formulário com menos campos e uma etapa posterior de qualificação.',
    previewLabel: 'Fluxo de captação · Opção B',
  },
  {
    id: 'approval-lucy-copy', projectId: 'lucy-acquisition', project: 'Sistema de aquisição local',
    client: 'Lucy Services Clean', clientId: 'lucy-services', title: 'Copy da página de serviço', type: 'Conteúdo',
    requestedAt: '12 ago, 11:15', due: 'Concluído', status: 'Aprovado', version: 'V3',
    description: 'Texto principal e blocos de confiança aprovados para publicação.',
    previewLabel: 'Residential Cleaning · Service Page',
  },
]

export const projectUpdates = [
  { id: 'update-1', type: 'delivery', title: 'Estrutura da campanha concluída', detail: 'Palavras-chave e anúncios organizados para revisão.', time: 'Hoje, 09:42', author: 'Iago' },
  { id: 'update-2', type: 'approval', title: 'Aprovação solicitada ao cliente', detail: 'Campanha de pesquisa · versão 2.', time: 'Hoje, 09:45', author: 'Sistema' },
  { id: 'update-3', type: 'comment', title: 'Nova observação no projeto', detail: 'O acompanhamento deve considerar ligações e formulários.', time: 'Ontem, 18:10', author: 'Iago' },
]

export const portalFiles = [
  { id: 'file-1', name: 'Plano-de-campanha-v2.pdf', type: 'PDF', size: '2,4 MB', updated: 'Hoje' },
  { id: 'file-2', name: 'Mapa-da-jornada.pdf', type: 'PDF', size: '1,1 MB', updated: '12 ago' },
  { id: 'file-3', name: 'Referencias-visuais.zip', type: 'ZIP', size: '18,7 MB', updated: '10 ago' },
  { id: 'file-4', name: 'Resumo-do-kickoff.docx', type: 'DOCX', size: '640 KB', updated: '08 ago' },
]
