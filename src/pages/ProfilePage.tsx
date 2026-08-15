import { useState } from 'react'
import { Camera, Check, KeyRound, Laptop, MapPin, Monitor, MoreHorizontal, ShieldCheck, Smartphone, X } from 'lucide-react'
import { Avatar, Badge, Button, Card, PageHeader } from '../components/ui'
import { useApp } from '../context/AppContext'

export function ProfilePage() {
  const { notify } = useApp()
  const [photoModal, setPhotoModal] = useState(false)
  const [rounded, setRounded] = useState(true)
  return (
    <div className="page">
      <PageHeader title="Perfil" description="Informações pessoais, segurança e sessões recentes." actions={<Button onClick={() => notify('Modo de edição ativado.')}>Editar perfil</Button>} />
      <div className="profile-hero"><button className={`profile-photo ${rounded ? '' : 'profile-photo--square'}`} onClick={() => setPhotoModal(true)}><Avatar name="Rafael Martins" size="lg" /><span><Camera size={15} /></span></button><div><h2>Rafael Martins</h2><p>alex@workspace.example</p><Badge tone="purple">Owner</Badge></div></div>
      <div className="profile-grid">
        <Card><div className="card-heading-row"><div><h2>Informações pessoais</h2><p>Dados visíveis no workspace.</p></div><button className="text-button">Editar</button></div><div className="details-grid"><div><small>Nome completo</small><strong>Rafael Martins</strong></div><div><small>Email</small><strong>alex@workspace.example</strong></div><div><small>Telefone</small><strong>+1 (000) 000-0000</strong></div><div><small>Função</small><strong>Operations Director</strong></div><div><small>Idioma</small><strong>Português (Brasil)</strong></div><div><small>Fuso horário</small><strong>America/Sao_Paulo</strong></div></div></Card>
        <Card><div className="card-heading-row"><div><h2>Sessões recentes</h2><p>Dispositivos com acesso à conta.</p></div><button><MoreHorizontal size={16} /></button></div><div className="session-list"><div><Monitor size={17} /><span><strong>Chrome — Windows</strong><small><MapPin size={12} /> São Paulo, SP · agora</small></span><Badge tone="green">Atual</Badge></div><div><Smartphone size={17} /><span><strong>Safari — iPhone</strong><small><MapPin size={12} /> São Paulo, SP · ontem</small></span></div><div><Laptop size={17} /><span><strong>Firefox — Windows</strong><small><MapPin size={12} /> Rio de Janeiro, RJ · 3 dias</small></span></div></div></Card>
      </div>
      <Card><div className="card-heading-row"><div><h2>Segurança</h2><p>Controles de acesso desta conta.</p></div></div><div className="security-list"><div><span className="security-list__icon"><KeyRound size={17} /></span><span><strong>Senha</strong><small>Alterada há 2 meses</small></span><Button>Trocar senha</Button></div><div><span className="security-list__icon"><ShieldCheck size={17} /></span><span><strong>Autenticação em duas etapas</strong><small>Ativa via aplicativo autenticador</small></span><button className="toggle-switch toggle-switch--active" onClick={() => notify('2FA permanece ativa por segurança.')}><i /></button></div></div></Card>
      {photoModal ? <div className="modal-layer" onMouseDown={(event) => event.currentTarget === event.target && setPhotoModal(false)}><div className="modal profile-photo-modal"><header><h2>Foto de perfil</h2><button onClick={() => setPhotoModal(false)}><X size={17} /></button></header><div className={`profile-photo-preview ${rounded ? '' : 'profile-photo-preview--square'}`}><Avatar name="Rafael Martins" size="lg" /></div><Button><Camera size={15} /> Enviar foto</Button><div className="shape-selector"><button className={rounded ? 'active' : ''} onClick={() => setRounded(true)}><span className="shape-round" />Redondo{rounded ? <Check size={14} /> : null}</button><button className={!rounded ? 'active' : ''} onClick={() => setRounded(false)}><span className="shape-square" />Quadrado{!rounded ? <Check size={14} /> : null}</button></div><div className="modal-actions"><Button onClick={() => setPhotoModal(false)}>Cancelar</Button><Button variant="primary" onClick={() => { setPhotoModal(false); notify('Formato da foto salvo.', 'success') }}>Salvar</Button></div></div></div> : null}
    </div>
  )
}
