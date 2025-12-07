import React from 'react';

interface AnalysisResultProps {
  result: string | null;
  isLoading: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-800">Анализ изображения...</h3>
        <p className="text-slate-500 mt-2 text-center max-w-xs">
          Искусственный интеллект сверяет данные с базой ФНП и docs.cntd.ru
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-500 font-medium">Результат анализа появится здесь</p>
        <p className="text-slate-400 text-sm mt-1">Загрузите фото и добавьте описание для начала</p>
      </div>
    );
  }

  // Simple Markdown-like parser for bold text and headers to avoid heavy dependencies
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b border-slate-200">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      
      // List items with bolding support
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <li key={index} className="ml-4 list-disc text-slate-700 mb-1">
             {parseBold(content)}
          </li>
        );
      }

      // Normal paragraphs
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }

      return <p key={index} className="text-slate-700 leading-relaxed mb-2">{parseBold(line)}</p>;
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Отчет эксперта
        </h2>
        <button 
          onClick={() => navigator.clipboard.writeText(result)}
          className="text-xs text-slate-500 hover:text-orange-600 font-medium transition-colors"
        >
          Копировать
        </button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        <div className="prose prose-slate max-w-none">
          {renderFormattedText(result)}
        </div>
      </div>
      <div className="bg-orange-50 px-6 py-3 border-t border-orange-100 text-xs text-orange-800">
        <strong>Отказ от ответственности:</strong> Данный анализ сгенерирован ИИ. Для официальных заключений обратитесь к сертифицированному эксперту по промышленной безопасности.
      </div>
    </div>
  );
};