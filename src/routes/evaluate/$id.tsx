import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { sidebarSchema } from '@/schemas/searchSchemas';
import MarkdownViewer from '@/components/markdown/MarkdownViewer';
import { useGetDocument } from '@/hooks/useGetDocument';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { requireAuth } from '@/utils/authGuard';
import { DocumentErrorView } from '@/components/common/DocumentErrorView';

export const Route = createFileRoute('/evaluate/$id')({
  component: RouteComponent,
  validateSearch: zodValidator(sidebarSchema),
  beforeLoad: () => requireAuth(),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useGetDocument(id);
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <div className="flex h-screen">
      <LeftSidebar
        selectedDocumentId={Number(id)}
        onSelectDocument={(docId) =>
          navigate({ to: '/evaluate/$id', params: { id: String(docId) } })
        }
      />
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-gray-50 px-13">
        {error ? (
          <DocumentErrorView error={error} />
        ) : data ? (
          <MarkdownViewer markdown={data.text ?? ''} paragraph={data.paragraphs} comments={[]} />
        ) : null}
      </div>
    </div>
  );
}
