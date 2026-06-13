export function javaToPython(code) {
  let lines = code.split("\n");
  let result = [];
  let indentLevel = 0;
  let needsMath = false;

  for (let line of lines) {
    let trimmed = line.trim();

    // Skip
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("import") || trimmed.startsWith("package")) {
      if (trimmed.startsWith("//")) result.push(indent(indentLevel) + "#" + trimmed.slice(2));
      continue;
    }

    // Closing brace
    if (trimmed === "}") { indentLevel = Math.max(0, indentLevel - 1); continue; }

    // Class declaration
    if (/^(public\s+)?(class)\s+(\w+)/.test(trimmed)) {
      const name = trimmed.match(/class\s+(\w+)/)[1];
      result.push(indent(indentLevel) + `class ${name}:`);
      indentLevel++;
      continue;
    }

    // main method
    if (/public\s+static\s+void\s+main\s*\(/.test(trimmed)) {
      result.push(indent(indentLevel) + "def main():");
      indentLevel++;
      continue;
    }

    // Method declaration
    const methodMatch = trimmed.match(/^(?:public|private|protected)?\s*(?:static\s+)?(?:int|double|float|String|boolean|void|long|char)\s+(\w+)\s*\((.*?)\)\s*\{?$/);
    if (methodMatch) {
      const params = convertParams(methodMatch[2]);
      result.push(indent(indentLevel) + `def ${methodMatch[1]}(${params}):`);
      indentLevel++;
      continue;
    }

    // if / else if / else
    if (/^if\s*\(/.test(trimmed)) {
      const cond = extractCondition(trimmed);
      result.push(indent(indentLevel) + `if ${convertCondition(cond)}:`);
      if (trimmed.endsWith("{")) indentLevel++;
      continue;
    }
    if (/^\}\s*else\s+if\s*\(/.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
      const cond = extractCondition(trimmed);
      result.push(indent(indentLevel) + `elif ${convertCondition(cond)}:`);
      indentLevel++;
      continue;
    }
    if (/^\}\s*else\s*\{?/.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
      result.push(indent(indentLevel) + "else:");
      indentLevel++;
      continue;
    }

    // for loop  for(int i = 0; i < n; i++)
    const forMatch = trimmed.match(/^for\s*\(\s*(?:int|long)\s+(\w+)\s*=\s*(-?\d+)\s*;\s*\1\s*([<>]=?)\s*(.+?)\s*;\s*\1(\+\+|--|(\s*[+\-]=\s*\d+))\s*\)\s*\{?$/);
    if (forMatch) {
      const [, v, start, op, end, step] = forMatch;
      let rangeEnd = op === "<" ? end : op === "<=" ? `${end} + 1` : end;
      let stepVal = (step === "++" || step.includes("+=1")) ? "" : step === "--" ? `, -1` : `, ${step.replace(/[+\-]=/,"").trim()}`;
      result.push(indent(indentLevel) + `for ${v} in range(${start}, ${rangeEnd}${stepVal}):`);
      if (trimmed.endsWith("{")) indentLevel++;
      continue;
    }

    // for-each  for(Type x : arr)
    const forEachMatch = trimmed.match(/^for\s*\(\s*\w+\s+(\w+)\s*:\s*(\w+)\s*\)\s*\{?$/);
    if (forEachMatch) {
      result.push(indent(indentLevel) + `for ${forEachMatch[1]} in ${forEachMatch[2]}:`);
      if (trimmed.endsWith("{")) indentLevel++;
      continue;
    }

    // while
    const whileMatch = trimmed.match(/^while\s*\((.+)\)\s*\{?$/);
    if (whileMatch) {
      result.push(indent(indentLevel) + `while ${convertCondition(whileMatch[1])}:`);
      if (trimmed.endsWith("{")) indentLevel++;
      continue;
    }

    // Print
    if (/System\.out\.println\(/.test(trimmed)) {
      const content = trimmed.match(/System\.out\.println\((.*)\);?$/)?.[1] || "";
      result.push(indent(indentLevel) + `print(${convertExpr(content)})`);
      continue;
    }
    if (/System\.out\.print\(/.test(trimmed)) {
      const content = trimmed.match(/System\.out\.print\((.*)\);?$/)?.[1] || "";
      result.push(indent(indentLevel) + `print(${convertExpr(content)}, end="")`);
      continue;
    }

    // return
    if (/^return\s+/.test(trimmed)) {
      const val = trimmed.replace(/^return\s+/, "").replace(/;$/, "");
      result.push(indent(indentLevel) + `return ${convertExpr(val)}`);
      continue;
    }

    // Variable declaration with assignment
    const declMatch = trimmed.match(/^(?:int|double|float|long|short|byte|String|boolean|char)\s+(\w+)\s*=\s*(.+);$/);
    if (declMatch) {
      result.push(indent(indentLevel) + `${declMatch[1]} = ${convertExpr(declMatch[2])}`);
      continue;
    }

    // Variable declaration without assignment
    const declNoVal = trimmed.match(/^(?:int|double|float|long|short|byte|String|boolean|char)\s+(\w+)\s*;$/);
    if (declNoVal) {
      result.push(indent(indentLevel) + `${declNoVal[1]} = None`);
      continue;
    }

    // Assignment
    const assignMatch = trimmed.match(/^(\w+)\s*([+\-*\/]?=)\s*(.+);$/);
    if (assignMatch) {
      result.push(indent(indentLevel) + `${assignMatch[1]} ${assignMatch[2]} ${convertExpr(assignMatch[3])}`);
      continue;
    }

    // i++ / i--
    if (/^\w+\+\+;$/.test(trimmed)) { result.push(indent(indentLevel) + trimmed.replace("++", " += 1").replace(";","")); continue; }
    if (/^\w+--;$/.test(trimmed))   { result.push(indent(indentLevel) + trimmed.replace("--", " -= 1").replace(";","")); continue; }

    // Fallback
    let converted = convertExpr(trimmed.replace(/;$/, ""));
    if (converted.includes("math.")) needsMath = true;
    result.push(indent(indentLevel) + converted);
  }

  let output = result.join("\n");
  if (needsMath) output = "import math\n\n" + output;
  output += '\n\nif __name__ == "__main__":\n    main()';
  return output;
}

function indent(level) { return "    ".repeat(level); }

function convertParams(params) {
  if (!params.trim()) return "";
  return params.split(",").map(p => p.trim().split(/\s+/).pop()).join(", ");
}

function extractCondition(line) {
  const m = line.match(/\((.+)\)/);
  return m ? m[1] : line;
}

function convertCondition(cond) {
  return cond
    .replace(/&&/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/!/g, "not ")
    .replace(/\.equals\("(.*?)"\)/g, ' == "$1"')
    .replace(/\.equals\((\w+)\)/g, " == $1")
    .replace(/true/g, "True")
    .replace(/false/g, "False")
    .replace(/null/g, "None");
}

function convertExpr(expr) {
  return expr
    .replace(/System\.out\.println\((.*?)\)/g, "print($1)")
    .replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, "($1 ** $2)")
    .replace(/Math\.sqrt\(([^)]+)\)/g, "math.sqrt($1)")
    .replace(/Math\.abs\(([^)]+)\)/g, "abs($1)")
    .replace(/Math\.max\(([^)]+)\)/g, "max($1)")
    .replace(/Math\.min\(([^)]+)\)/g, "min($1)")
    .replace(/Math\.floor\(([^)]+)\)/g, "math.floor($1)")
    .replace(/Math\.ceil\(([^)]+)\)/g, "math.ceil($1)")
    .replace(/Math\.round\(([^)]+)\)/g, "round($1)")
    .replace(/Math\.PI/g, "math.pi")
    .replace(/\.length\(\)/g, ".__len__()")
    .replace(/\.length/g, ".__len__()")
    .replace(/\.toUpperCase\(\)/g, ".upper()")
    .replace(/\.toLowerCase\(\)/g, ".lower()")
    .replace(/\.trim\(\)/g, ".strip()")
    .replace(/\.equals\("(.*?)"\)/g, ' == "$1"')
    .replace(/\.equals\((\w+)\)/g, " == $1")
    .replace(/\.equalsIgnoreCase\(([^)]+)\)/g, ".lower() == ($1).lower()")
    .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
    .replace(/\.substring\(([^,]+),\s*([^)]+)\)/g, "[$1:$2]")
    .replace(/\.contains\(([^)]+)\)/g, ".__contains__($1)")
    .replace(/\.replace\(([^,]+),\s*([^)]+)\)/g, ".replace($1, $2)")
    .replace(/\.split\(([^)]+)\)/g, ".split($1)")
    .replace(/\.indexOf\(([^)]+)\)/g, ".index($1)")
    .replace(/\.toCharArray\(\)/g, "list(...)")
    .replace(/\bnew\s+\w+\[([^\]]+)\]/g, "[None] * $1")
    .replace(/\bnew\s+ArrayList<.*?>\(\)/g, "[]")
    .replace(/\.add\(([^)]+)\)/g, ".append($1)")
    .replace(/\.size\(\)/g, ".__len__()")
    .replace(/\.get\(([^)]+)\)/g, "[$1]")
    .replace(/\.set\(([^,]+),\s*([^)]+)\)/g, "[$1] = $2")
    .replace(/\btrue\b/g, "True")
    .replace(/\bfalse\b/g, "False")
    .replace(/\bnull\b/g, "None")
    .replace(/\(int\)\s*/g, "int(")
    .replace(/\(double\)\s*/g, "float(")
    .replace(/\(String\)\s*/g, "str(")
    .replace(/Integer\.parseInt\(([^)]+)\)/g, "int($1)")
    .replace(/Double\.parseDouble\(([^)]+)\)/g, "float($1)")
    .replace(/String\.valueOf\(([^)]+)\)/g, "str($1)");
}