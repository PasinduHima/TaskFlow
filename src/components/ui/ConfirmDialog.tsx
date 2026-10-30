import { useId } from 'react'
import { TriangleAlert } from 'lucide-react'
import type { ConfirmOptions } from '@/context/contexts'
import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps extends ConfirmOptions {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, description, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId()

  return (
    <Modal open onClose={onCancel} labelledBy={titleId}>
      <div className="p-6">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-8 ring-rose-50/50 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/5">
            <TriangleAlert className="size-5" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h2 id={titleId} className="text-base font-semibold text-zinc-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed break-words text-zinc-500 dark:text-zinc-400">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} data-autofocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
