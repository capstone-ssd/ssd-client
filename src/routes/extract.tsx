import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/extract')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/extract"!</div>
}
