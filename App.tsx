import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeSafetyImage } from './services/geminiService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    selectedImage: null,
    selectedFile: null,
  });

  const [description, setDescription] = useState('');

  const handleImageSelect = (file: File) => {
    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      selectedImage: imageUrl,
      selectedFile: file,
      error: null, // Clear errors on new input
    }));
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      selectedImage: null,
      selectedFile: null,
      result: null,
      error: null
    }));
    setDescription('');
  };

  const handleAnalyze = async () => {
    if (!state.selectedFile) {
      setState(prev => ({ ...prev, error: "Пожалуйста, загрузите изображение." }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));

    try {
      const result = await analyzeSafetyImage(state.selectedFile, description);
      setState(prev => ({
        ...prev,
        isLoading: false,
        result: result
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Произошла ошибка при анализе."
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 border-l-4 border-orange-500 pl-3">
                Вводные данные
              </h2>
              
              <div className="space-y-6">
                <ImageUpload 
                  selectedImage={state.selectedImage}
                  onImageSelect={handleImageSelect}
                  onClear={handleClear}
                  disabled={state.isLoading}
                />

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Описание ситуации (опционально)
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-3 border resize-none"
                    placeholder="Например: 'Запорная арматура на паропроводе, отсутствует изоляция...'"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={state.isLoading}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Чем точнее описание, тем качественнее анализ ИИ.
                  </p>
                </div>

                {state.error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{state.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={state.isLoading || !state.selectedFile}
                  className={`
                    w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                    transition-all duration-200
                    ${state.isLoading || !state.selectedFile 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-slate-900 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'}
                  `}
                >
                  {state.isLoading ? 'Анализ...' : 'Проверить на нарушения'}
                </button>
              </div>
            </div>

            {/* Helper Info Card */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Как это работает?</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc ml-4">
                <li>Загрузите четкое фото оборудования.</li>
                <li>Добавьте контекст в описании.</li>
                <li>ИИ проверит соответствие ФНП.</li>
                <li>Получите список нарушений и ссылки на пункты.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <AnalysisResult result={state.result} isLoading={state.isLoading} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;