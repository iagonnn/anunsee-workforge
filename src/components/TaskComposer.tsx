import { useState } from 'react'
import { CalendarDays, CheckSquare2, Flag, FolderKanban, Tag, UserRound } from 'lucide-react'
import { useApp, type WorkspaceTask } from '../context/AppContext'
import { Button, Modal } from './ui'

const emptyForm: Omit<WorkspaceTask, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  project: 'Portal Northstar',
  client: 'Horizonte Arquitetura',
  assignee: 'Rafael Martins',
  status: 'Aberta',
  priority: 'Média',
  due: '2026-07-16',
  estimate: '1h',
  tags: [],
}

export function TaskComposer() {
  const { taskComposerOpen, closeTaskComposer, createTask, notify } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [tagText, setTagText] = useState('')
  if (!taskComposerOpen) return null

  const submit = () => {
    if (!form.title.trim()) {
      notify('Informe um título para a tarefa.', 'error')
      return
    }
    createTask({ ...form, title: form.title.trim(), tags: tagText.split(',').map((item) => item.trim()).filter(Boolean) })
    setForm(emptyForm)
    setTagText('')
    closeTaskComposer()
    notify('Tarefa criada e adicionada ao workspace.', 'success')
  }

  return (
    <Modal title="Nova tarefa" description="Crie uma tarefa conectada ao projeto, cliente e responsável certos." onClose={closeTaskComposer} size="lg">
      <div className="composer-form">
        <label className="field field--full">
          <span><CheckSquare2 size={15} /> Título</span>
          <input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="O que precisa ser feito?" />
        </label>
        <label className="field field--full">
          <span>Descrição</span>
          <textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Contexto, resultado esperado e observações..." />
        </label>
        <div className="form-grid form-grid--three">
          <label className="field"><span><FolderKanban size={15} /> Projeto</span><select value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })}><option>Portal Northstar</option><option>Site Clínica Aurora</option><option>Automação comercial</option><option>Operação</option></select></label>
          <label className="field"><span>Cliente</span><select value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })}><option>Horizonte Arquitetura</option><option>Clínica Aurora</option><option>Atlas Renovations</option><option>Interno</option></select></label>
          <label className="field"><span><UserRound size={15} /> Responsável</span><select value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })}><option>Rafael Martins</option><option>Camila Rocha</option><option>Bruno Tavares</option><option>Larissa Mendes</option></select></label>
          <label className="field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as WorkspaceTask['status'] })}><option>Aberta</option><option>Em andamento</option><option>Revisão</option><option>Concluída</option></select></label>
          <label className="field"><span><Flag size={15} /> Prioridade</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as WorkspaceTask['priority'] })}><option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option></select></label>
          <label className="field"><span><CalendarDays size={15} /> Prazo</span><input type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} /></label>
          <label className="field"><span>Estimativa</span><input value={form.estimate} onChange={(event) => setForm({ ...form, estimate: event.target.value })} placeholder="Ex.: 2h" /></label>
          <label className="field field--span-two"><span><Tag size={15} /> Tags</span><input value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="Comercial, urgente, cliente" /></label>
        </div>
        <div className="modal-actions"><Button onClick={closeTaskComposer}>Cancelar</Button><Button variant="primary" onClick={submit}>Criar tarefa</Button></div>
      </div>
    </Modal>
  )
}
