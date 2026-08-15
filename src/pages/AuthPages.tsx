import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Copy, Download, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react'
import { Button } from '../components/ui'
import { useApp } from '../context/AppContext'

function AuthBrand() {
  return <div className="auth-brand"><span>W</span>WORKFORGE</div>
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@workforge.app')
  const [password, setPassword] = useState('demo-only')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const { onboardingCompleted } = useApp()
  const valid = email.includes('@') && password.length >= 6

  const submit = () => {
    if (!valid) return
    setLoading(true)
    window.setTimeout(() => {
      localStorage.setItem('wf-demo-user', email)
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding')
    }, 650)
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card auth-card--login">
          <AuthBrand />
          <div className="auth-heading"><h1>Bem-vindo de volta</h1><p>Entre na sua conta para continuar.</p></div>
          <div className="form-stack">
            <label>Email profissional<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@empresa.com" /></label>
            <label>Senha<div className="password-field"><input value={password} onChange={(event) => setPassword(event.target.value)} type={visible ? 'text' : 'password'} placeholder="Digite sua senha" /><button type="button" onClick={() => setVisible((current) => !current)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            <Button variant="primary" loading={loading} disabled={!valid} onClick={submit}>Entrar</Button>
            <Button onClick={() => setLoading(true)}>Enviar magic link</Button>
            <div className="auth-divider"><span>ou continue com</span></div>
            <div className="social-grid"><button>G</button><button>◉</button><button>⊞</button></div>
          </div>
          <div className="auth-links"><Link to="/signup">Criar conta</Link><button>Esqueci minha senha</button></div>
          <p className="auth-legal">Ao entrar, você concorda com os Termos de Serviço e a Política de Privacidade.</p>
        </div>
      </section>
      <aside className="auth-preview">
        <div className="auth-preview__glow" />
        <div className="auth-preview__copy"><span className="eyebrow">Uma operação mais calma</span><h2>Projetos, clientes e equipe no mesmo ritmo.</h2><p>Uma base única para organizar vendas, atendimento, projetos e automações.</p></div>
        <div className="auth-preview__board">
          <div className="mini-card"><span>Projetos ativos</span><strong>24</strong><small>+12% este mês</small></div>
          <div className="mini-card"><span>Capacidade</span><strong>78%</strong><small>Equipe equilibrada</small></div>
          <div className="mini-feed"><i /><span><strong>Portal aprovado</strong><small>Horizonte Arquitetura · agora</small></span></div>
          <div className="mini-feed"><i /><span><strong>Relatório concluído</strong><small>WorkForge AI · 2 min</small></span></div>
        </div>
      </aside>
    </main>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [selectedCases, setSelectedCases] = useState<string[]>(['Gestão de projetos'])
  const cases = ['Gestão de projetos', 'Agência', 'Operações', 'Portal do cliente']
  const toggleCase = (value: string) => setSelectedCases((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value])

  return (
    <main className="auth-layout auth-layout--single">
      <section className="auth-panel">
        <div className="auth-card auth-card--signup">
          <AuthBrand />
          <div className="auth-heading"><h1>Crie sua conta</h1><p>Configure o primeiro workspace do WorkForge.</p></div>
          <div className="form-stack form-stack--compact">
            <label>Nome completo<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Seu nome" /></label>
            <label>Email profissional<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@empresa.com" /></label>
            <label>Senha<div className="password-field"><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Crie uma senha forte" /><button type="button"><Eye size={16} /></button></div></label>
            <label>Nome do workspace<input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Sua empresa" /></label>
            <label>Subdomínio<div className="suffix-field"><input placeholder="suaempresa" /><span>.workforge.app</span></div></label>
            <label>Tamanho da equipe<select defaultValue=""><option value="" disabled>Selecione</option><option>1–10 pessoas</option><option>11–50 pessoas</option><option>51–200 pessoas</option></select></label>
            <fieldset className="chip-field"><legend>Principais casos de uso</legend><div>{cases.map((item) => <button type="button" className={selectedCases.includes(item) ? 'selected' : ''} onClick={() => toggleCase(item)} key={item}>{selectedCases.includes(item) ? <Check size={13} /> : null}{item}</button>)}</div></fieldset>
            <label className="check-row"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>Concordo com os <a>Termos de Serviço</a> e a <a>Política de Privacidade</a>.</span></label>
            <Button variant="primary" disabled={!accepted || !fullName.trim() || !email.includes('@') || password.length < 6 || !workspaceName.trim()} onClick={() => { localStorage.setItem('wf-demo-user', email); localStorage.setItem('wf-signup-workspace', workspaceName); navigate('/onboarding') }}>Criar conta</Button>
          </div>
          <div className="auth-links auth-links--center"><span>Já possui uma conta?</span><Link to="/login">Entrar</Link></div>
        </div>
      </section>
    </main>
  )
}

const recoveryCodes = ['WF-A2K8-P91F', 'WF-R7M4-Q2LX', 'WF-T9D3-K8VP', 'WF-H4N1-Z6CJ', 'WF-E5S8-L3BG', 'WF-U2P7-X9RA', 'WF-C8V4-M1TD', 'WF-J3Q6-F7NW']

export function TwoFactorPage() {
  const navigate = useNavigate()
  const { notify } = useApp()
  const [tab, setTab] = useState<'app' | 'codes'>('app')
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  const complete = code.every(Boolean)
  const maskedCodes = useMemo(() => recoveryCodes.map(() => '••••••••••••'), [])
  const [showCodes, setShowCodes] = useState(false)

  const updateCode = (value: string, index: number) => {
    const next = [...code]
    next[index] = value.replace(/\D/g, '').slice(-1)
    setCode(next)
    if (next[index] && index < 5) inputs.current[index + 1]?.focus()
  }

  return (
    <main className="auth-layout auth-layout--single two-factor-layout">
      <section className="two-factor-wrap">
        <div className="auth-heading"><h1>Proteja sua conta</h1><p>Configure a autenticação em duas etapas para adicionar uma camada extra de segurança.</p></div>
        <div className="two-factor-card">
          <div className="two-factor-tabs">
            <button className={tab === 'app' ? 'active' : ''} onClick={() => setTab('app')}><KeyRound size={16} /> Aplicativo autenticador</button>
            <button className={tab === 'codes' ? 'active' : ''} onClick={() => setTab('codes')}><ShieldAlert size={16} /> Códigos de recuperação</button>
          </div>
          {tab === 'app' ? (
            <div className="two-factor-content">
              <div className="two-factor-icon"><KeyRound size={22} /></div>
              <h2>Configure o aplicativo autenticador</h2>
              <p>Leia o QR code com Google Authenticator, Authy ou outro aplicativo compatível.</p>
              <div className="qr-shell"><div className="qr-placeholder">QR</div><small>Ou insira a chave manualmente:</small><div className="secret-row"><code>DEMO-ONLY-NOT-A-SECRET</code><button onClick={() => notify('Chave copiada.', 'success')}><Copy size={15} /></button></div></div>
              <span className="field-label">Digite o código de verificação</span>
              <div className="otp-row">{code.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element }} value={digit} inputMode="numeric" maxLength={1} onChange={(event) => updateCode(event.target.value, index)} />)}</div>
              <Button variant="primary" disabled={!complete} onClick={() => setTab('codes')}>Verificar</Button>
              <button className="text-button">Problemas de horário? Sincronize o relógio do dispositivo</button>
            </div>
          ) : (
            <div className="two-factor-content two-factor-content--codes">
              <div className="two-factor-icon two-factor-icon--warning"><ShieldAlert size={22} /></div>
              <h2>Códigos de recuperação</h2>
              <p>Guarde estes códigos em um local seguro. Cada código pode ser utilizado apenas uma vez.</p>
              <div className="warning-panel"><ShieldAlert size={18} /><span><strong>Importante</strong><small>Não compartilhe estes códigos com outras pessoas.</small></span></div>
              <div className="recovery-panel"><div className="recovery-panel__header"><strong>Seus códigos</strong><button onClick={() => setShowCodes((current) => !current)}>{showCodes ? 'Ocultar' : 'Mostrar códigos'}</button></div><div className="recovery-grid">{(showCodes ? recoveryCodes : maskedCodes).map((item) => <code key={item}>{item}</code>)}</div><div className="recovery-actions"><Button onClick={() => notify('Todos os códigos foram copiados.', 'success')}><Copy size={15} /> Copiar todos</Button><Button onClick={() => notify('Download simulado concluído.', 'success')}><Download size={15} /> Baixar .txt</Button></div></div>
              <div className="two-factor-footer"><Button variant="primary" onClick={() => navigate('/dashboard')}>Continuar configuração</Button><Button onClick={() => navigate('/dashboard')}>Pular por agora</Button></div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
