import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import guideHeader from '@/assets/images/guide-header.png';
import writerImg from '@/assets/images/writer.png';
import evaluatorImg from '@/assets/images/evaluator.png';

export const Route = createFileRoute('/guide')({
  component: RouteComponent,
});

type Tab = 'writer' | 'evaluator';

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('writer');

  return (
    <div className="flex flex-col items-center">
      <img src={guideHeader} alt="가이드 헤더" className="w-full" />

      <div className="flex bg-white mt-6 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setActiveTab('writer')}
          className={`w-56 h-14 text-lg font-bold rounded-lg transition-colors ${
            activeTab === 'writer'
              ? 'bg-yellow-400 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          작성하기
        </button>
        <button
          onClick={() => setActiveTab('evaluator')}
          className={`w-56 h-14 text-lg font-bold rounded-lg transition-colors ${
            activeTab === 'evaluator'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          편집하기
        </button>
      </div>

      <div className="mt-6 w-full">
        <img
          src={activeTab === 'writer' ? writerImg : evaluatorImg}
          alt={activeTab === 'writer' ? '작성하기 가이드' : '편집하기 가이드'}
          className="w-full"
        />
      </div>
    </div>
  );
}
