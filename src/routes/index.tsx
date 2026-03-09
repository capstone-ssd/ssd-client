import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import writingLogo from '../assets/images/logo-writing.png';
import DocUploadModal from '@/components/modal/DocUploadModal';
import { DashboardCard, type CardVariant } from '@/components/dashboard-card/DashboardCard';
import { CARD_META } from '@/components/dashboard-card/dashboard';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useFolderQuery } from '@/hooks/useFolderQuery';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

type UploadMode = 'writing' | 'evaluate';

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate: upload, isPending } = useDocumentUpload();
  const { data: folderData, isLoading: isFolderLoading } = useFolderQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<UploadMode>('writing');

  function openModal(mode: UploadMode) {
    setActiveMode(mode);
    setIsModalOpen(true);
  }

  function handleConfirm(file: File | null, folderId: number | null) {
    if (!file) return;
    upload({ file, folderId, mode: activeMode }, { onSuccess: () => setIsModalOpen(false) });
  }

  const handlers: Record<CardVariant, (() => void) | undefined> = {
    writing: () => openModal('writing'),
    evaluate: () => openModal('evaluate'),
    library: () => navigate({ to: '/library' }),
    calendar: undefined,
  };

  return (
    <main className="bg-primary-50 flex h-full w-screen items-center justify-center gap-25">
      <section className="flex flex-col items-start" aria-label="심사임당 서비스 로고">
        <img src={writingLogo} alt="심사임당 펜촉 메모장 로고 이미지" className="h-136.5 w-136.5" />
        <p className="flex text-[130px] leading-none font-bold" aria-label="심사임당">
          <span className="text-gray-900">심사</span>
          <span className="text-primary-300">임당</span>
        </p>
      </section>

      <section className="grid grid-cols-2 gap-6" aria-label="주요 기능 목록">
        {CARD_META.map((card) => (
          <DashboardCard key={card.variant} {...card} onClick={handlers[card.variant]} />
        ))}
      </section>

      <DocUploadModal
        isOpen={isModalOpen}
        data={folderData ?? null}
        isLoading={isFolderLoading || isPending}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </main>
  );
}
