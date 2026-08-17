import { useState } from 'react';
import { ExampleCode } from '../data/examples';

interface SidebarProps {
  examples: ExampleCode[];
  activeExample: string | null;
  onSelect: (example: ExampleCode) => void;
}

export function Sidebar({ examples, activeExample, onSelect }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>('أساسيات');

  const categories = [...new Set(examples.map(e => e.category))];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
        📚 أمثلة جاهزة
        <span className="text-xs text-slate-500 font-normal">({examples.length})</span>
      </h2>

      <div className="space-y-1">
        {categories.map((category) => {
          const categoryExamples = examples.filter(e => e.category === category);
          const isExpanded = expandedCategory === category;

          return (
            <div key={category}>
              <button
                onClick={() => setExpandedCategory(isExpanded ? '' : category)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-700/40 transition-all text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                <span>{category}</span>
                <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>◀</span>
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-1 mr-2 border-r-2 border-slate-700/50 pr-3">
                  {categoryExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => onSelect(example)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs transition-all ${
                        activeExample === example.id
                          ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="font-medium">{example.titleAr}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{example.titleEn}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 p-3 rounded-xl bg-gradient-to-bl from-indigo-900/20 to-blue-900/20 border border-indigo-700/30">
        <h3 className="text-xs font-bold text-indigo-300 mb-2">💡 نصائح سريعة</h3>
        <ul className="space-y-1.5 text-[11px] text-slate-400">
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span>اكتب كود بايثون في المحرر</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span>اختر أمثلة من القائمة</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span>راجع الشرح خطوة بخطوة</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span>تتبع المتغيرات عبر الوقت</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
