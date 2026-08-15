import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle, X } from 'lucide-react'

export function Button({ className = '', variant = 'secondary', loading = false, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
}) {
  return (
    <button className={`button button--${variant} ${className}`} {...props} disabled={props.disabled || loading}>
      {loading ? <LoaderCircle size={16} className="spin" /> : null}
      {children}
    </button>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'orange' | 'purple' | 'blue' | 'red' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Avatar({ name = 'Camila Rocha', size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('')
  return <span className={`avatar avatar--${size}`} aria-label={name}>{initials}</span>
}

export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  )
}

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}

export function Modal({ title, description, onClose, children, size = 'md' }: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return (
    <div className="modal-layer" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__header">
          <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={17} /></button>
        </header>
        {children}
      </section>
    </div>
  )
}

export function Drawer({ title, description, onClose, children, wide = false }: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return (
    <div className="drawer-layer" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <aside className={`detail-drawer ${wide ? 'detail-drawer--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="detail-drawer__header">
          <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={17} /></button>
        </header>
        <div className="detail-drawer__content">{children}</div>
      </aside>
    </div>
  )
}
