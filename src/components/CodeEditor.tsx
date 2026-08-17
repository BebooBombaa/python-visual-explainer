import { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = code.split('\n');
    setLineCount(Math.max(lines.length, 1));
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-slate-400 mr-2">code.py</span>
        </div>
        <div className="text-xs text-slate-500">
          {lineCount} سطر
        </div>
      </div>

      <div className="flex" dir="ltr">
        {/* Line Numbers */}
        <div className="py-4 px-2 text-right select-none bg-slate-900/50 border-l border-slate-700/30 min-w-[3rem]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-xs text-slate-500 leading-6 font-mono"
              style={{ lineHeight: '1.5rem' }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent text-slate-200 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
          style={{ lineHeight: '1.5rem', tabSize: 4 }}
          placeholder="# اكتب كود بايثون هنا..."
        />
      </div>
    </div>
  );
}
