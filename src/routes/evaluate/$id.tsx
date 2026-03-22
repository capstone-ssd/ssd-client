import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { sidebarSchema } from '@/schemas/searchSchemas';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import { useGetDocument } from '@/hooks/useGetDocument';

export const Route = createFileRoute('/evaluate/$id')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading } = useGetDocument(id);

  if (isLoading) return null;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-13">
      <MarkdownViewer markdown={data.text ?? ''} paragraph={data.paragraphs} comments={[]} />
    </div>
  );
}
