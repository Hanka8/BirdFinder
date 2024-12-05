import { createLazyFileRoute } from '@tanstack/react-router'
import BirdPage from '../components/BirdPage'

export const Route = createLazyFileRoute('/$bird')({
  component: () => <BirdPage />,
})