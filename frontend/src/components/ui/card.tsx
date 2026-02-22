import * as React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return <div className={`rounded-xl border border-slate-200 bg-card p-6 shadow-sm ${className}`} {...props} />
}
