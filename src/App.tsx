import { useState, useMemo } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { StepVisualizer } from './components/StepVisualizer';
import { VariableWatch } from './components/VariableWatch';
import { Sidebar } from './components/Sidebar';
import { FlowOverview } from './components/FlowOverview';
import { exampleCodes } from './data/examples';
import { analyzePythonCode } from './pythonParser';

// 🔗 غيّر هذا الرابط إلى مستودعك بعد النشر على GitHub
export const REPO_URL = 'https://github.com/BebooBombaa/python-visual-explainer';

const defaultCode = `# مرحباً! اكتب كود بايثون هنا
name = "أحمد"
age = 25

if age >= 18:
    print("أنت بالغ")
else:
    print("أنت قاصر")

for i in range(5):
    print(i)`;

export default function App() {
  const [code, setCode] = useState(defaultCode);
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'steps' | 'flow' | 'variables'>('steps');

  const analysis = useMemo(() => analyzePythonCode(code), [code]);

  const handleExampleSelect = (example: (typeof exampleCodes)[0]) => {
    setCode(example.code);
    setActiveExample(example.id);
  };

  const totalVars = analysis.steps.length > 0
    ? analysis.steps[analysis.steps.length - 1].variables.length
    : 0;
  const hasOutput = analysis.steps.some(s => s.stepType === 'print');
  const hasConditions = analysis.steps.some(s => s.stepType === 'if' || s.stepType === 'elif');
  const hasLoops = analysis.steps.some(s => s.stepType === 'for' || s.stepType === 'while');

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-blue-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
              🐍
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-l from-yellow-300 to-blue-400 bg-clip-text text-transparent">
                مُفسّر بايثون المرئي
              </h1>
              <p className="text-xs text-slate-400">Python Visual Code Explorer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats badges */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/50">
                📋 {analysis.totalSteps} خطوة
              </span>
              <span className="px-2 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/50">
                📦 {totalVars} متغير
              </span>
              {hasOutput && (
                <span className="px-2 py-1 rounded-lg bg-green-900/30 text-green-400 border border-green-700/30">
                  🖨️ يوجد طباعة
                </span>
              )}
              {hasConditions && (
                <span className="px-2 py-1 rounded-lg bg-amber-900/30 text-amber-400 border border-amber-700/30">
                  🔀 يوجد شروط
                </span>
              )}
              {hasLoops && (
                <span className="px-2 py-1 rounded-lg bg-purple-900/30 text-purple-400 border border-purple-700/30">
                  🔄 يوجد حلقات
                </span>
              )}
            </div>

            {/* GitHub link */}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="المشروع على GitHub — مفتوح المصدر"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50 text-xs font-medium text-slate-300"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              <span className="hidden sm:inline">المصدر</span>
            </a>

            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'إخفاء القائمة' : 'إظهار القائمة'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50"
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 border-l border-slate-700/50 bg-slate-900/40 p-4 overflow-y-auto">
            <Sidebar
              examples={exampleCodes}
              activeExample={activeExample}
              onSelect={handleExampleSelect}
            />
          </aside>
        )}

        {/* Main Area */}
        <main className="flex-1 p-4 space-y-4 min-w-0">
          {/* Code Editor */}
          <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Visualizer Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/40 rounded-xl p-1 border border-slate-700/50 w-fit">
            <button
              onClick={() => setActiveTab('steps')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'steps'
                  ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 الشرح خطوة بخطوة
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'flow'
                  ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ خريطة التنفيذ
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'variables'
                  ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 المتغيرات
            </button>
          </div>

          {/* Content Area */}
          {activeTab === 'steps' && (
            <StepVisualizer steps={analysis.steps} />
          )}
          {activeTab === 'flow' && (
            <FlowOverview steps={analysis.steps} />
          )}
          {activeTab === 'variables' && (
            <VariableWatch analysis={analysis} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/30 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 py-6 text-center space-y-3">
          <p className="text-xs text-slate-400">
            🐍 <span className="font-semibold text-slate-300">مُفسّر بايثون المرئي</span> — أداة تعليمية
            مفتوحة المصدر لمساعدة الطلاب على فهم كود بايثون بشكل بصري
          </p>

          <div className="flex items-center justify-center gap-4 text-xs">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              ⭐ المستودع
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              🤝 ساهم معنا
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={`${REPO_URL}/issues/new/choose`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              🐛 أبلغ عن خطأ
            </a>
          </div>

          <p className="text-[11px] text-slate-600">
            رخصة MIT · الإصدار 1.0.0 · يعمل بالكامل في متصفحك — لا يُرسل كودك لأي خادم 🔒
          </p>
        </div>
      </footer>
    </div>
  );
}
