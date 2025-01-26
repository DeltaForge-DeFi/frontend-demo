import { LitePage } from '@/pages/lite'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/lite')({
  component: LitePage,
})
