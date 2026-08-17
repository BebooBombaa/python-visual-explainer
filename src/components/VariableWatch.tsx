import { useState } from 'react';
import { AnalysisResult, getTypeArabic } from '../pythonParser';

interface VariableWatchProps {
  analysis: AnalysisResult;
}

const typeColors: Record<string, string> = {
  int: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
  float: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-300',
  string: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-300',
  bool: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300',
  list: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-300',
  dict: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-300',
  unknown: 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-300',
};

const typeIcons: Record<string, string> = {
  int: '🔢',
  float: '🔢',
  string: '📝',
  bool: '✅',
  list: '📋',
  dict: '📖',
  unknown: '❓',
};

export function VariableWatch({ analysis }: VariableWatchProps) {
  const [selectedStep, setSelectedStep] = useState(analysis.steps.length - 1);

  if (analysis.steps.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-12 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">لا توجد متغيرات بعد</h3>
        <p className="text-slate-500">اكتب كود يحتوي على متغيرات لرصد حالتها</p>
      </div>
    );
  }

  // Track variable history
  const variableHistory = new Map<string, { steps: { step: number; value: string; type: string; isNew?: boolean; changed?: boolean }[] }>();

  analysis.steps.forEach((step, idx) => {
    step.variables.forEach(v => {
      if (!variableHistory.has(v.name)) {
        variableHistory.set(v.name, { steps: [] });
      }
      variableHistory.get(v.name)!.steps.push({
        step: idx,
        value: v.value,
        type: v.type,
        isNew: v.isNew,
        changed: v.changed,
      });
    });
  });

  return (
    <div className="space-y-4">
      {/* Step Selector */}
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
        <label className="text-sm text-slate-400 mb-2 block">
          اختر الخطوة للعرض:
          <span className="text-blue-400 font-bold mr-1">
            {selectedStep + 1} / {analysis.steps.length}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={analysis.steps.length - 1}
          value={selectedStep}
          onChange={(e) => setSelectedStep(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-slate-700 accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>بداية</span>
          <span>نهاية</span>
        </div>
      </div>

      {/* Current Variables */}
      <div>
        <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
          📦 حالة المتغيرات في الخطوة {selectedStep + 1}
        </h3>

        {analysis.steps[selectedStep]?.variables.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>لا توجد متغيرات في هذه الخطوة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysis.steps[selectedStep]?.variables.map((v, vi) => (
              <div
                key={vi}
                className={`rounded-xl border bg-gradient-to-bl p-4 transition-all hover:scale-[1.02] ${
                  typeColors[v.type] || typeColors.unknown
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{typeIcons[v.type] || typeIcons.unknown}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                    {getTypeArabic(v.type)}
                  </span>
                </div>
                <div className="font-mono font-bold text-lg mb-1">{v.name}</div>
                <div className="font-mono text-sm opacity-80 break-all">= {v.value}</div>
                {v.isNew && (
                  <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                    🆕 جديد
                  </span>
                )}
                {v.changed && !v.isNew && (
                  <span className="inline-block mt-2 text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                    🔄 تم التعديل
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variable History Timeline */}
      {variableHistory.size > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
            📈 تطور المتغيرات عبر الخطوات
          </h3>
          <div className="space-y-3">
            {Array.from(variableHistory.entries()).map(([varName, history]) => (
              <div key={varName} className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono font-bold text-blue-300">{varName}</span>
                  <span className="text-xs text-slate-500">
                    ({history.steps.length} تغييرات)
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {history.steps.slice(-10).map((s, si) => (
                    <button
                      key={si}
                      onClick={() => setSelectedStep(s.step)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                        s.step === selectedStep
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : s.isNew
                          ? 'bg-green-900/30 text-green-300 hover:bg-green-800/40'
                          : s.changed
                          ? 'bg-amber-900/30 text-amber-300 hover:bg-amber-800/40'
                          : 'bg-slate-700/30 text-slate-400 hover:bg-slate-600/40'
                      }`}
                    >
                      <span className="text-slate-500">#{s.step + 1}</span>
                      <span>→</span>
                      <span className="font-bold">{s.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
