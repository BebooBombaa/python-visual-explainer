import { CodeStep } from '../pythonParser';

interface StepVisualizerProps {
  steps: CodeStep[];
}

const stepIcons: Record<string, { icon: string; bg: string; border: string; label: string }> = {
  empty: { icon: '·', bg: '', border: '', label: '' },
  comment: { icon: '💬', bg: 'bg-slate-700/30', border: 'border-slate-600/40', label: 'تعليق' },
  import: { icon: '📦', bg: 'bg-orange-900/20', border: 'border-orange-700/30', label: 'استيراد' },
  print: { icon: '🖨️', bg: 'bg-green-900/20', border: 'border-green-700/30', label: 'طباعة' },
  function_def: { icon: '⚙️', bg: 'bg-blue-900/20', border: 'border-blue-700/30', label: 'دالة' },
  function_call: { icon: '📞', bg: 'bg-blue-900/20', border: 'border-blue-700/30', label: 'استدعاء' },
  return: { icon: '↩️', bg: 'bg-cyan-900/20', border: 'border-cyan-700/30', label: 'إرجاع' },
  if: { icon: '🔀', bg: 'bg-amber-900/20', border: 'border-amber-700/30', label: 'شرط' },
  elif: { icon: '🔀', bg: 'bg-amber-900/20', border: 'border-amber-700/30', label: 'شرط آخر' },
  else: { icon: '🔀', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30', label: 'إلا' },
  for: { icon: '🔄', bg: 'bg-purple-900/20', border: 'border-purple-700/30', label: 'حلقة' },
  while: { icon: '🔁', bg: 'bg-purple-900/20', border: 'border-purple-700/30', label: 'حلقة While' },
  assignment: { icon: '📝', bg: 'bg-indigo-900/20', border: 'border-indigo-700/30', label: 'تعيين' },
  augmented_assign: { icon: '✏️', bg: 'bg-indigo-900/20', border: 'border-indigo-700/30', label: 'تعديل' },
  comparison: { icon: '⚖️', bg: 'bg-pink-900/20', border: 'border-pink-700/30', label: 'مقارنة' },
  unknown: { icon: '❓', bg: 'bg-slate-700/20', border: 'border-slate-600/30', label: 'غير معروف' },
  try: { icon: '🛡️', bg: 'bg-red-900/20', border: 'border-red-700/30', label: 'حماية' },
};

export function StepVisualizer({ steps }: StepVisualizerProps) {
  const meaningfulSteps = steps.filter(s => s.stepType !== 'empty');

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-12 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">ابدأ بكتابة الكود</h3>
        <p className="text-slate-500">اكتب كود بايثون في المحرر أعلاه لرؤية الشرح المرئي</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meaningfulSteps.map((step, index) => {
        const iconInfo = stepIcons[step.stepType] || stepIcons.unknown;
        const vars = step.variables;
        const changedVars = vars.filter(v => v.isNew || v.changed);

        return (
          <div
            key={index}
            className={`rounded-xl border ${iconInfo.border} ${iconInfo.bg} transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 group`}
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-700/30">
              {/* Step Number */}
              <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                {step.executionOrder}
              </div>

              {/* Line Number */}
              <span className="text-xs text-slate-500 font-mono shrink-0">
                سطر {step.line}
              </span>

              {/* Icon & Label */}
              <span className="text-lg">{iconInfo.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400">
                {iconInfo.label}
              </span>

              {/* Condition value */}
              {step.conditionValue !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  step.conditionValue ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                }`}>
                  {step.conditionValue ? '✓ صحيح' : '✗ خطأ'}
                </span>
              )}

              {/* Loop Info */}
              {step.loopInfo && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-800/40 text-purple-300">
                  {step.loopInfo.variable}: 0 إلى {step.loopInfo.totalIterations - 1}
                </span>
              )}

              {/* Output */}
              {step.output && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-green-800/40 text-green-300 ml-auto shrink-0">
                  🖨️ {step.output}
                </span>
              )}
            </div>

            {/* Code & Explanation */}
            <div className="p-4 space-y-3">
              {/* Code Line */}
              <div dir="ltr" className="bg-slate-900/60 rounded-lg px-4 py-2.5 font-mono text-sm text-cyan-300 border border-slate-700/30">
                <code className="whitespace-pre-wrap">{step.originalLine}</code>
              </div>

              {/* Explanation */}
              {step.explanationAr && (
                <div className="bg-gradient-to-l from-slate-800/40 to-transparent rounded-lg px-4 py-3 border-r-4 border-r-blue-500/50">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="text-blue-400 font-bold ml-1">💡 </span>
                    {step.explanationAr}
                  </p>
                </div>
              )}

              {/* Changed Variables */}
              {changedVars.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {changedVars.map((v, vi) => (
                    <div
                      key={vi}
                      className={`rounded-lg px-3 py-2 text-xs font-mono border ${
                        v.isNew
                          ? 'bg-green-900/20 border-green-700/30 text-green-300'
                          : v.changed
                          ? 'bg-amber-900/20 border-amber-700/30 text-amber-300'
                          : ''
                      }`}
                    >
                      <span className="text-slate-400">{v.name}</span>
                      <span className="mx-1">=</span>
                      <span className="font-bold">{v.value}</span>
                      <span className="text-slate-500 mr-1">({v.type})</span>
                      {v.isNew && <span className="mr-1">🆕</span>}
                      {v.changed && !v.isNew && <span className="mr-1">🔄</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < meaningfulSteps.length - 1 && (
              <div className="flex justify-center -mb-2">
                <div className="w-px h-4 bg-slate-600/50" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
