import { ProPage } from '@/pages/pro'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/pro')({
  component: ProPage,
})
