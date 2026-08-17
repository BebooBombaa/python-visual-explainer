import { CodeStep } from '../pythonParser';

interface FlowOverviewProps {
  steps: CodeStep[];
}

const flowIcons: Record<string, { icon: string; color: string; labelAr: string }> = {
  empty: { icon: '', color: '', labelAr: '' },
  comment: { icon: '💬', color: 'bg-slate-500', labelAr: 'تعليق' },
  import: { icon: '📦', color: 'bg-orange-500', labelAr: 'استيراد' },
  print: { icon: '🖨️', color: 'bg-green-500', labelAr: 'طباعة' },
  function_def: { icon: '⚙️', color: 'bg-blue-500', labelAr: 'دالة' },
  function_call: { icon: '📞', color: 'bg-blue-400', labelAr: 'استدعاء' },
  return: { icon: '↩️', color: 'bg-cyan-500', labelAr: 'إرجاع' },
  if: { icon: '🔀', color: 'bg-amber-500', labelAr: 'شرط' },
  elif: { icon: '🔀', color: 'bg-amber-400', labelAr: 'شرط آخر' },
  else: { icon: '🔁', color: 'bg-yellow-500', labelAr: 'إلا' },
  for: { icon: '🔄', color: 'bg-purple-500', labelAr: 'حلقة for' },
  while: { icon: '🔁', color: 'bg-purple-400', labelAr: 'حلقة while' },
  assignment: { icon: '📝', color: 'bg-indigo-500', labelAr: 'تعيين' },
  augmented_assign: { icon: '✏️', color: 'bg-indigo-400', labelAr: 'تعديل' },
  comparison: { icon: '⚖️', color: 'bg-pink-500', labelAr: 'مقارنة' },
  unknown: { icon: '❓', color: 'bg-gray-500', labelAr: 'أخرى' },
  try: { icon: '🛡️', color: 'bg-red-500', labelAr: 'حماية' },
};

export function FlowOverview({ steps }: FlowOverviewProps) {
  const meaningfulSteps = steps.filter(s => s.stepType !== 'empty');
  const stepTypes = meaningfulSteps.map(s => s.stepType);

  // Count step types
  const typeCounts = new Map<string, number>();
  stepTypes.forEach(type => {
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });

  if (meaningfulSteps.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-12 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">أدخل كوداً لعرض خريطة التنفيذ</h3>
        <p className="text-slate-500">اكتب كود بايثون لرؤية خريطة التنفيذ المرئية</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from(typeCounts.entries()).map(([type, count]) => {
          const info = flowIcons[type] || flowIcons.unknown;
          return (
            <div
              key={type}
              className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-lg ${info.color} bg-opacity-20 flex items-center justify-center text-xl`}>
                {info.icon}
              </div>
              <div>
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-xs text-slate-400">{info.labelAr}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow Diagram */}
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          🗺️ خريطة تنفيذ الكود
        </h3>

        <div className="flex items-center gap-0 overflow-x-auto pb-4">
          {/* Start Node */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/30">
              بداية
            </div>
          </div>

          {/* Flow Arrows & Nodes */}
          {meaningfulSteps.map((step, index) => {
            const info = flowIcons[step.stepType] || flowIcons.unknown;
            return (
              <div key={index} className="flex items-center shrink-0">
                {/* Arrow */}
                <div className="w-6 h-px bg-slate-600 mx-1" />

                {/* Node */}
                <div className="flex flex-col items-center gap-1 group">
                  <div
                    className={`w-10 h-10 rounded-lg ${info.color} bg-opacity-20 flex items-center justify-center text-lg border border-slate-600/50 transition-transform group-hover:scale-110 cursor-default`}
                    title={info.labelAr}
                  >
                    {info.icon}
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {step.line}
                  </span>

                  {/* Condition indicator */}
                  {step.conditionValue !== undefined && (
                    <div className={`w-2 h-2 rounded-full ${
                      step.conditionValue ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  )}
                </div>
              </div>
            );
          })}

          {/* End Arrow */}
          <div className="w-6 h-px bg-slate-600 mx-1" />

          {/* End Node */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-500/30">
              نهاية
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Flow Steps */}
      <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          📋 التفاصيل المنفذة
        </h3>
        <div className="space-y-2">
          {meaningfulSteps.map((step, index) => {
            const info = flowIcons[step.stepType] || flowIcons.unknown;
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-all group"
              >
                {/* Number */}
                <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                  {step.executionOrder}
                </span>

                {/* Icon */}
                <span className="text-base shrink-0">{info.icon}</span>

                {/* Label */}
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/40 text-slate-400 shrink-0">
                  {info.labelAr}
                </span>

                {/* Code */}
                <span className="text-xs font-mono text-slate-300 truncate" dir="ltr">
                  {step.originalLine}
                </span>

                {/* Output */}
                {step.output && (
                  <span className="text-xs text-green-400 ml-auto shrink-0">
                    ← {step.output}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
