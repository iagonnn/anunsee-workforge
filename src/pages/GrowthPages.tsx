import { useState } from 'react'
import { ArrowRight, BarChart3, CalendarDays, FileText, Globe2, Megaphone, MessageSquareText, Plus, Search, Send, Star } from 'lucide-react'
import { Badge, Button, Card, Modal, PageHeader } from '../components/ui'
import { useApp } from '../context/AppContext'

export function MarketingPage() {
  const { notify } = useApp()
  const [campaigns, setCampaigns] = useState([
    { name: 'Captação de leads — Julho', channel: 'Meta Ads', status: 'Ativa', result: '126 leads', period: '01–31 jul' },
    { name: 'Reativação de clientes', channel: 'WhatsApp', status: 'Rascunho', result: '0 enviados', period: 'Planejamento' },
    { name: 'Conteúdo institucional', channel: 'Instagram', status: 'Agendada', result: '12 publicações', period: 'Próximos 30 dias' },
  ])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  return <div className="page page--wide growth-page"><PageHeader eyebrow="Crescimento" title="Marketing" description="Campanhas, conteúdo e resultados organizados por canal." actions={<Button variant="primary" onClick={() => setOpen(true)}><Plus size={16} /> Nova campanha</Button>} />
    <div className="growth-hero-grid"><Card><span><Megaphone size={18} /></span><strong>3</strong><small>campanhas ativas</small></Card><Card><span><BarChart3 size={18} /></span><strong>126</strong><small>leads no período</small></Card><Card><span><CalendarDays size={18} /></span><strong>18</strong><small>conteúdos agendados</small></Card></div>
    <Card className="campaign-board"><header><div><h2>Campanhas</h2><p>Visão comercial, não um gerenciador genérico de itens.</p></div><div className="search-field"><Search size={15} /><input placeholder="Buscar campanha..." /></div></header><div className="campaign-list">{campaigns.map((campaign) => <button key={campaign.name}><span className="campaign-channel"><Megaphone size={16} /></span><span><strong>{campaign.name}</strong><small>{campaign.channel} · {campaign.period}</small></span><Badge tone={campaign.status === 'Ativa' ? 'green' : campaign.status === 'Agendada' ? 'blue' : 'neutral'}>{campaign.status}</Badge><span><strong>{campaign.result}</strong><small>resultado</small></span><ArrowRight size={15} /></button>)}</div></Card>
    {open ? <Modal title="Nova campanha" description="Cadastro local para organizar o planejamento." onClose={() => setOpen(false)}><div className="composer-form"><label className="field field--full"><span>Nome</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} /></label><label className="field field--full"><span>Canal</span><select><option>Meta Ads</option><option>WhatsApp</option><option>Email</option><option>Instagram</option></select></label><div className="modal-actions"><Button onClick={() => setOpen(false)}>Cancelar</Button><Button variant="primary" disabled={!name.trim()} onClick={() => { setCampaigns((items) => [{ name: name.trim(), channel: 'Meta Ads', status: 'Rascunho', result: '0 leads', period: 'Não definido' }, ...items]); setOpen(false); setName(''); notify('Campanha criada.', 'success') }}>Criar campanha</Button></div></div></Modal> : null}
  </div>
}

export function SitesPage() {
  return <div className="page page--wide growth-page"><PageHeader eyebrow="Crescimento" title="Sites e formulários" description="Páginas de captação e formulários em uma central visual." actions={<Button variant="primary"><Plus size={16} /> Nova página</Button>} />
    <div className="site-assets-grid"><Card className="site-preview-card"><div className="site-preview-card__image"><Globe2 size={28} /></div><div><Badge tone="green">Publicada</Badge><h3>Landing page principal</h3><p>Captura de diagnóstico comercial</p><footer><span>2.418 visitas</span><strong>8,4% conversão</strong></footer></div></Card><Card className="site-preview-card"><div className="site-preview-card__image site-preview-card__image--form"><FileText size={28} /></div><div><Badge tone="blue">Formulário</Badge><h3>Solicitar orçamento</h3><p>7 campos · conectado ao Pipeline</p><footer><span>184 respostas</span><strong>92% completas</strong></footer></div></Card><Card className="site-preview-card site-preview-card--new"><Plus size={25} /><h3>Criar novo ativo</h3><p>O editor completo permanece simulado nesta versão.</p></Card></div>
  </div>
}

export function ReputationPage() {
  const { notify } = useApp()
  const [responses, setResponses] = useState<Record<string, boolean>>({})
  const reviews = [
    { id: 'r1', author: 'Mariana Costa', score: 5, text: 'Equipe organizada e comunicação excelente durante todo o projeto.', source: 'Google' },
    { id: 'r2', author: 'Ricardo Alves', score: 4, text: 'A implantação foi rápida e tivemos um bom acompanhamento.', source: 'Facebook' },
    { id: 'r3', author: 'Fernanda Lima', score: 5, text: 'Finalmente conseguimos centralizar as demandas da equipe.', source: 'Google' },
  ]
  return <div className="page page--wide reputation-page"><PageHeader eyebrow="Crescimento" title="Reputação" description="Avaliações, respostas e solicitações de feedback." actions={<Button variant="primary"><Send size={16} /> Solicitar avaliação</Button>} />
    <div className="reputation-summary"><Card><span>Nota média</span><strong>4,8</strong><div>{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}</div></Card><Card><span>Avaliações</span><strong>184</strong><small>+18 neste mês</small></Card><Card><span>Taxa de resposta</span><strong>{Object.keys(responses).length ? '100%' : '67%'}</strong><small>Responda para melhorar</small></Card></div>
    <Card className="review-list-card"><header><div><h2>Avaliações recentes</h2><p>Respostas ficam registradas localmente.</p></div></header><div className="review-list">{reviews.map((review) => <article key={review.id}><div className="review-list__top"><span><strong>{review.author}</strong><small>{review.source}</small></span><div>{Array.from({ length: review.score }).map((_, index) => <Star key={index} size={13} fill="currentColor" />)}</div></div><p>{review.text}</p>{responses[review.id] ? <div className="review-response"><MessageSquareText size={15} /><span><strong>Resposta publicada localmente</strong><small>Obrigado pelo feedback! Ficamos felizes com sua experiência.</small></span></div> : <Button onClick={() => { setResponses((current) => ({ ...current, [review.id]: true })); notify('Resposta salva.', 'success') }}>Responder</Button>}</article>)}</div></Card>
  </div>
}
