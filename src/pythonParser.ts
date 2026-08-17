// Python code analyzer - generates step-by-step visual explanations

export interface CodeStep {
  line: number;
  originalLine: string;
  explanation: string;
  explanationAr: string;
  stepType:
    | 'variable'
    | 'assignment'
    | 'print'
    | 'if'
    | 'elif'
    | 'else'
    | 'for'
    | 'while'
    | 'function_def'
    | 'function_call'
    | 'return'
    | 'comparison'
    | 'comment'
    | 'empty'
    | 'augmented_assign'
    | 'list_access'
    | 'method_call'
    | 'import'
    | 'try'
    | 'except'
    | 'unknown';
  variables: VariableState[];
  output?: string;
  executionOrder: number;
  indent: number;
  conditionValue?: boolean;
  loopInfo?: { variable: string; range: string; currentIteration: number; totalIterations: number };
}

export interface VariableState {
  name: string;
  value: string;
  type: string;
  isNew?: boolean;
  changed?: boolean;
}

export interface AnalysisResult {
  steps: CodeStep[];
  variablesAtEnd: VariableState[];
  totalSteps: number;
}

const AUGMENTED_REGEX = new RegExp('^(\\w+)\\s*(\\+=|-=|\\*=|\\/=|//=' + '|%)=\\s*(.+)$');

export function analyzePythonCode(code: string): AnalysisResult {
  const lines = code.split('\n');
  const steps: CodeStep[] = [];
  const variables: Map<string, { value: string; type: string }> = new Map();
  let executionOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: '',
        explanationAr: '',
        stepType: 'empty',
        variables: getVarArray(variables),
        executionOrder,
        indent: getIndent(rawLine),
      });
      continue;
    }

    const indent = getIndent(rawLine);

    if (line.startsWith('#')) {
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: line.substring(1).trim(),
        explanationAr: line.substring(1).trim(),
        stepType: 'comment',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    if (line.startsWith('import ') || line.startsWith('from ')) {
      executionOrder++;
      const moduleName = line.replace(/import |from | as .*/g, '').trim();
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Importing module: ${moduleName}`,
        explanationAr: `استيراد وحدة: ${moduleName}`,
        stepType: 'import',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    const printMatch = line.match(/^print\((.+)\)$/);
    if (printMatch) {
      const content = printMatch[1];
      let output = evaluateExpression(content.trim(), variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Print: ${output}`,
        explanationAr: `طباعة: ${output}`,
        stepType: 'print',
        variables: getVarArray(variables),
        output: String(output),
        executionOrder,
        indent,
      });
      continue;
    }

    const funcDefMatch = line.match(/^def\s+(\w+)\(([^)]*)\):/);
    if (funcDefMatch) {
      const funcName = funcDefMatch[1];
      const params = funcDefMatch[2];
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Define function "${funcName}" with parameters: ${params || 'none'}`,
        explanationAr: `تعريف دالة "${funcName}" بالمعاملات: ${params || 'لا يوجد'}`,
        stepType: 'function_def',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    const returnMatch = line.match(/^return\s+(.+)$/);
    if (returnMatch) {
      const returnValue = returnMatch[1].trim();
      const evaluatedValue = evaluateExpression(returnValue, variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Return value: ${evaluatedValue}`,
        explanationAr: `إرجاع القيمة: ${evaluatedValue}`,
        stepType: 'return',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    const ifMatch = line.match(/^if\s+(.+):$/);
    if (ifMatch) {
      const condition = ifMatch[1].trim();
      const conditionResult = evaluateCondition(condition, variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Check condition: ${condition}`,
        explanationAr: `التحقق من الشرط: ${condition}`,
        stepType: 'if',
        variables: getVarArray(variables),
        executionOrder,
        indent,
        conditionValue: conditionResult,
      });
      continue;
    }

    const elifMatch = line.match(/^elif\s+(.+):$/);
    if (elifMatch) {
      const condition = elifMatch[1].trim();
      const conditionResult = evaluateCondition(condition, variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Check condition: ${condition}`,
        explanationAr: `التحقق من الشرط: ${condition}`,
        stepType: 'elif',
        variables: getVarArray(variables),
        executionOrder,
        indent,
        conditionValue: conditionResult,
      });
      continue;
    }

    if (line === 'else:') {
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: 'Else block - all conditions above were false',
        explanationAr: 'كتلة else - جميع الشروط السابقة كانت خاطئة',
        stepType: 'else',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    const forMatch = line.match(/^for\s+(\w+)\s+in\s+(.+):$/);
    if (forMatch) {
      const loopVar = forMatch[1];
      const rangeStr = forMatch[2].trim();
      let rangeDesc = rangeStr;
      let totalIterations = 0;

      if (rangeStr.startsWith('range(')) {
        const rangeContent = rangeStr.replace('range(', '').replace(')', '').split(',').map(s => s.trim());
        let start = 0, end = 0, step = 1;
        if (rangeContent.length === 1) {
          end = parseInt(rangeContent[0]) || 0;
        } else if (rangeContent.length === 2) {
          start = parseInt(rangeContent[0]) || 0;
          end = parseInt(rangeContent[1]) || 0;
        } else if (rangeContent.length === 3) {
          start = parseInt(rangeContent[0]) || 0;
          end = parseInt(rangeContent[1]) || 0;
          step = parseInt(rangeContent[2]) || 1;
        }
        if (typeof start === 'number' && typeof end === 'number' && typeof step === 'number') {
          totalIterations = Math.max(0, Math.floor((end - start) / step));
          rangeDesc = `${start} إلى ${end}`;
        }
      }

      executionOrder++;
      variables.set(loopVar, { value: 'يبدأ', type: 'int' });
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Start loop: for ${loopVar} in ${rangeStr}`,
        explanationAr: `بداية الحلقة: for ${loopVar} in ${rangeDesc}`,
        stepType: 'for',
        variables: getVarArray(variables),
        executionOrder,
        indent,
        loopInfo: {
          variable: loopVar,
          range: rangeStr,
          currentIteration: 0,
          totalIterations,
        },
      });
      continue;
    }

    const whileMatch = line.match(/^while\s+(.+):$/);
    if (whileMatch) {
      const condition = whileMatch[1].trim();
      const conditionResult = evaluateCondition(condition, variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Check while condition: ${condition}`,
        explanationAr: `التحقق من شرط while: ${condition}`,
        stepType: 'while',
        variables: getVarArray(variables),
        executionOrder,
        indent,
        conditionValue: conditionResult,
      });
      continue;
    }

    if (line.startsWith('try:') || line.startsWith('except')) {
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: line.startsWith('try:') ? 'Try block - attempt to execute code' : `Exception handling: ${line}`,
        explanationAr: line.startsWith('try:') ? 'كتلة try - محاولة تنفيذ الكود' : `التعامل مع الخطأ: ${line}`,
        stepType: 'try',
        variables: getVarArray(variables),
        executionOrder,
        indent,
      });
      continue;
    }

    const augAssignMatch = line.match(AUGMENTED_REGEX);
    if (augAssignMatch) {
      const varName = augAssignMatch[1];
      const op = augAssignMatch[2];
      const value = augAssignMatch[3].trim();
      const currentValue = variables.get(varName);
      let newValue = value;
      let varType = 'number';

      if (currentValue) {
        const numVal = parseFloat(currentValue.value);
        const numOp = parseFloat(evaluateExpression(value, variables));
        if (!isNaN(numVal) && !isNaN(numOp)) {
          switch (op) {
            case '+=': newValue = String(numVal + numOp); break;
            case '-=': newValue = String(numVal - numOp); break;
            case '*=': newValue = String(numVal * numOp); break;
            case '/=': newValue = String(numVal / numOp); break;
            case '//=': newValue = String(Math.floor(numVal / numOp)); break;
            case '%=': newValue = String(numVal % numOp); break;
          }
          varType = currentValue.type;
        } else if (currentValue.type === 'string' && op === '+=') {
          newValue = currentValue.value + evaluateExpression(value, variables);
          varType = 'string';
        }
      }

      executionOrder++;
      variables.set(varName, { value: newValue, type: varType });
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `${varName} ${op} ${value} → ${varName} = ${newValue}`,
        explanationAr: `${varName} ${op} ${value} → ${varName} = ${newValue}`,
        stepType: 'augmented_assign',
        variables: Array.from(variables.entries()).map(([name, v]) => ({
          name,
          value: v.value,
          type: v.type,
          changed: name === varName,
        })),
        executionOrder,
        indent,
      });
      continue;
    }

    const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      const value = assignMatch[2].trim();
      const evaluated = evaluateExpression(value, variables);
      let varType = inferType(value, evaluated, variables);

      executionOrder++;
      const isNew = !variables.has(varName);
      variables.set(varName, { value: String(evaluated), type: varType });
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `${varName} = ${evaluated} (${varType})`,
        explanationAr: `${varName} = ${evaluated} (${getTypeArabic(varType)})`,
        stepType: 'assignment',
        variables: Array.from(variables.entries()).map(([name, v]) => ({
          name,
          value: v.value,
          type: v.type,
          isNew: name === varName && isNew,
          changed: name === varName && !isNew,
        })),
        executionOrder,
        indent,
      });
      continue;
    }

    const compMatch = line.match(/^(\w+)\s*(==|!=|<=|>=|<|>)\s*(.+)$/);
    if (compMatch) {
      const result = evaluateCondition(line, variables);
      executionOrder++;
      steps.push({
        line: i + 1,
        originalLine: rawLine,
        explanation: `Comparison: ${line} → ${result}`,
        explanationAr: `مقارنة: ${line} → ${result}`,
        stepType: 'comparison',
        variables: getVarArray(variables),
        executionOrder,
        indent,
        conditionValue: result,
      });
      continue;
    }

    executionOrder++;
    steps.push({
      line: i + 1,
      originalLine: rawLine,
      explanation: line,
      explanationAr: line,
      stepType: 'unknown',
      variables: getVarArray(variables),
      executionOrder,
      indent,
    });
  }

  return {
    steps,
    variablesAtEnd: Array.from(variables.entries()).map(([name, v]) => ({
      name,
      value: v.value,
      type: v.type,
    })),
    totalSteps: executionOrder,
  };
}

function getVarArray(variables: Map<string, { value: string; type: string }>): VariableState[] {
  return Array.from(variables.entries()).map(([name, v]) => ({
    name,
    value: v.value,
    type: v.type,
  }));
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function evaluateExpression(expr: string, variables: Map<string, { value: string; type: string }>): string {
  if ((expr.startsWith("'") && expr.endsWith("'")) || (expr.startsWith('"') && expr.endsWith('"'))) {
    return expr.slice(1, -1);
  }

  if (expr.startsWith('f"') || expr.startsWith("f'")) {
    return evaluateFString(expr, variables);
  }

  if (expr === 'True') return 'True';
  if (expr === 'False') return 'False';
  if (expr === 'None') return 'None';
  if (expr.startsWith('[')) return expr;
  if (expr.startsWith('{')) return expr;

  if (expr.startsWith('range')) return expr;
  if (expr.startsWith('len(')) return '?';
  if (expr.startsWith('list(')) return '[...]';
  if (expr.startsWith('str(')) return evaluateExpression(expr.replace('str(', '').replace(')', ''), variables);
  if (expr.startsWith('int(')) return evaluateExpression(expr.replace('int(', '').replace(')', ''), variables);
  if (expr.startsWith('float(')) return evaluateExpression(expr.replace('float(', '').replace(')', ''), variables);
  if (expr.startsWith('input(')) return '[user input]';

  if (expr.includes('.')) {
    return '[method result]';
  }

  if (variables.has(expr)) {
    return variables.get(expr)!.value;
  }

  try {
    const replacedExpr = expr.replace(/\b(\w+)\b/g, (match) => {
      if (variables.has(match)) {
        const val = variables.get(match)!.value;
        return isNaN(Number(val)) ? `"${val}"` : val;
      }
      if (match === 'True') return '1';
      if (match === 'False') return '0';
      if (!isNaN(Number(match))) return match;
      return match;
    });
    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${replacedExpr})`)();
    return typeof result === 'number' ? (Number.isInteger(result) ? result.toString() : result.toFixed(2)) : String(result);
  } catch {
    return expr;
  }
}

function evaluateFString(expr: string, variables: Map<string, { value: string; type: string }>): string {
  const inner = expr.slice(2, -1);
  return inner.replace(/\{([^}]+)\}/g, (_, match) => {
    const val = evaluateExpression(match.trim(), variables);
    return String(val);
  });
}

function evaluateCondition(expr: string, variables: Map<string, { value: string; type: string }>): boolean {
  try {
    let processedExpr = expr;
    processedExpr = processedExpr.replace(/\b(\w+)\b/g, (match) => {
      if (match === 'and') return '&&';
      if (match === 'or') return '||';
      if (match === 'not') return '!';
      if (match === 'True') return 'true';
      if (match === 'False') return 'false';
      if (match === 'None') return 'null';
      if (variables.has(match)) {
        const val = variables.get(match)!.value;
        if (val === 'True') return 'true';
        if (val === 'False') return 'false';
        if (val === 'None') return 'null';
        return isNaN(Number(val)) ? `"${val}"` : val;
      }
      if (!isNaN(Number(match))) return match;
      return match;
    });
    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${processedExpr})`)();
    return !!result;
  } catch {
    return true;
  }
}

function inferType(expr: string, evaluated: string, variables: Map<string, { value: string; type: string }>): string {
  if (expr.startsWith("'") || expr.startsWith('"')) return 'string';
  if (expr === 'True' || expr === 'False') return 'bool';
  if (expr === 'None') return 'NoneType';
  if (expr.startsWith('[')) return 'list';
  if (expr.startsWith('{')) return 'dict';
  if (expr.startsWith('(')) return 'tuple';
  if (expr.startsWith('range')) return 'range';
  if (variables.has(expr)) {
    return variables.get(expr)!.type;
  }
  if (!isNaN(Number(evaluated))) return 'int';
  if (isNaN(Number(evaluated))) return 'string';
  return 'unknown';
}

export function getTypeArabic(type: string): string {
  const map: Record<string, string> = {
    int: 'عدد صحيح',
    float: 'عدد عشري',
    string: 'نص',
    bool: 'منطقي',
    list: 'قائمة',
    dict: 'قاموس',
    tuple: 'مجموعة',
    NoneType: 'فارغ',
    range: 'مدى',
    unknown: 'غير معروف',
  };
  return map[type] || type;
}
