import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PromSafety AI</h1>
            <p className="text-xs text-slate-400">Экспертная система промышленной безопасности</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-sm text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            База знаний: docs.cntd.ru / ФНП РФ
          </span>
        </div>
      </div>
    </header>
  );
};