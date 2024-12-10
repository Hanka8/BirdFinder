import { createFileRoute } from '@tanstack/react-router'
import Index from '../components/Index'

export const Route = createFileRoute('/location/$latitude/$longitude')({
  component: Index,
})