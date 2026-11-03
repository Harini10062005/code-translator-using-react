export function translateCode(code, targetLanguage) {
  const lines = code.split("\n");
  const output = [];

  for (let line of lines) {
    const trimmed = line.trim();
    const translated = convertLine(trimmed, targetLanguage);
    output.push(translated);
  }

  return output.filter(l => l !== "__SKIP__").join("\n").trim();
}

function convertLine(line, lang) {

  if (!line) return "";
  if (/^(import|package)\s/i.test(line)) return "__SKIP__";
  if (line === "{" || line === "}") return line;


  if (line.startsWith("//")) return line;


  const println = line.match(/System\s*\.\s*out\s*\.\s*println\s*\((.*)\)\s*;?/i);
  if (println) {
    const val = convertExpr(println[1], lang);
    if (lang === "Python")     return `print(${val})`;
    if (lang === "JavaScript") return `console.log(${val});`;
    if (lang === "C++")        return `cout << ${val} << endl;`;
    if (lang === "C#")         return `Console.WriteLine(${val});`;
  }

  const print = line.match(/System\s*\.\s*out\s*\.\s*print\s*\((.*)\)\s*;?/i);
  if (print) {
    const val = convertExpr(print[1], lang);
    if (lang === "Python")     return `print(${val}, end="")`;
    if (lang === "JavaScript") return `process.stdout.write(${val});`;
    if (lang === "C++")        return `cout << ${val};`;
    if (lang === "C#")         return `Console.Write(${val});`;
  }

  
  if (/Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;?/i.test(line)) {
    if (lang === "Python")     return `# Python uses input() directly`;
    if (lang === "JavaScript") return `const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });`;
    if (lang === "C++")        return `// C++ uses cin directly`;
    if (lang === "C#")         return `// C# uses Console.ReadLine() directly`;
  }

  const nextInt   = line.match(/(\w+)\s*=\s*\w+\.nextInt\s*\(\s*\)\s*;?/i);
  const nextDouble= line.match(/(\w+)\s*=\s*\w+\.nextDouble\s*\(\s*\)\s*;?/i);
  const nextLine  = line.match(/(\w+)\s*=\s*\w+\.nextLine\s*\(\s*\)\s*;?/i);
  const nextVar   = line.match(/(?:int|double|float|String)\s+(\w+)\s*=\s*\w+\.next\w*\s*\(\s*\)\s*;?/i);

  if (nextInt) {
    const v = nextInt[1];
    if (lang === "Python")     return `${v} = int(input())`;
    if (lang === "JavaScript") return `const ${v} = parseInt(await rl.question(""));`;
    if (lang === "C++")        return `cin >> ${v};`;
    if (lang === "C#")         return `${v} = int.Parse(Console.ReadLine());`;
  }
  if (nextDouble) {
    const v = nextDouble[1];
    if (lang === "Python")     return `${v} = float(input())`;
    if (lang === "JavaScript") return `const ${v} = parseFloat(await rl.question(""));`;
    if (lang === "C++")        return `cin >> ${v};`;
    if (lang === "C#")         return `${v} = double.Parse(Console.ReadLine());`;
  }
  if (nextLine) {
    const v = nextLine[1];
    if (lang === "Python")     return `${v} = input()`;
    if (lang === "JavaScript") return `const ${v} = await rl.question("");`;
    if (lang === "C++")        return `getline(cin, ${v});`;
    if (lang === "C#")         return `${v} = Console.ReadLine();`;
  }

  
  const classMatch = line.match(/^(?:public\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{?/i);
  if (classMatch) {
    const name = classMatch[1];
    const parent = classMatch[2];
    if (lang === "Python")     return `class ${name}${parent ? `(${parent})` : ""}:`;
    if (lang === "JavaScript") return `class ${name}${parent ? ` extends ${parent}` : ""} {`;
    if (lang === "C++")        return `class ${name}${parent ? ` : public ${parent}` : ""} {\npublic:`;
    if (lang === "C#")         return `class ${name}${parent ? ` : ${parent}` : ""}\n{`;
  }

  
  if (/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/i.test(line)) {
    if (lang === "Python")     return `def main():`;
    if (lang === "JavaScript") return `function main() {`;
    if (lang === "C++")        return `int main() {`;
    if (lang === "C#")         return `static void Main(string[] args)\n{`;
  }


  const method = line.match(/^(?:public|private|protected)?\s*(?:static\s+)?(int|double|float|long|String|boolean|void|char)\s+(\w+)\s*\(([^)]*)\)\s*\{?$/i);
  if (method) {
    const ret    = method[1];
    const name   = method[2];
    const params = method[3];
    const pyParams = params.trim()
      ? params.split(",").map(p => p.trim().split(/\s+/).pop()).join(", ")
      : "";
    const cppParams = params.trim()
      ? params.split(",").map(p => {
          const parts = p.trim().split(/\s+/);
          return parts.length >= 2 ? `${cppType(parts[0])} ${parts[parts.length - 1]}` : p.trim();
        }).join(", ")
      : "";

    if (lang === "Python")     return `def ${name}(${pyParams}):`;
    if (lang === "JavaScript") return `function ${name}(${pyParams}) {`;
    if (lang === "C++")        return `${cppType(ret)} ${name}(${cppParams}) {`;
    if (lang === "C#")         return `public ${csType(ret)} ${name}(${cppParams})\n{`;
  }

  const elseIf = line.match(/^\}\s*else\s+if\s*\((.+)\)\s*\{?$/i);
  if (elseIf) {
    const cond = convertCondition(elseIf[1], lang);
    if (lang === "Python")     return `elif ${cond}:`;
    if (lang === "JavaScript") return `} else if (${cond}) {`;
    if (lang === "C++")        return `} else if (${cond}) {`;
    if (lang === "C#")         return `}\nelse if (${cond})\n{`;
  }

  const elseMatch = line.match(/^\}\s*else\s*\{?$/i);
  if (elseMatch) {
    if (lang === "Python")     return `else:`;
    if (lang === "JavaScript") return `} else {`;
    if (lang === "C++")        return `} else {`;
    if (lang === "C#")         return `}\nelse\n{`;
  }

  const ifMatch = line.match(/^if\s*\((.+)\)\s*\{?$/i);
  if (ifMatch) {
    const cond = convertCondition(ifMatch[1], lang);
    if (lang === "Python")     return `if ${cond}:`;
    if (lang === "JavaScript") return `if (${cond}) {`;
    if (lang === "C++")        return `if (${cond}) {`;
    if (lang === "C#")         return `if (${cond})\n{`;
  }

  
  const forLoop = line.match(/^for\s*\(\s*(?:int|long)\s+(\w+)\s*=\s*(-?\d+)\s*;\s*\1\s*([<>]=?)\s*(.+?)\s*;\s*\1(\+\+|--|\s*\+=\s*\d+)\s*\)\s*\{?$/i);
  if (forLoop) {
    const [, v, start, op, end, step] = forLoop;
    const end2     = (op === "<=" || op === ">=") ? `${end} + 1` : end;
    const stepVal  = step.includes("++") ? "" : step.includes("--") ? ", -1" : `, ${step.replace(/\+=/, "").trim()}`;

    if (lang === "Python")     return `for ${v} in range(${start}, ${end2}${stepVal}):`;
    if (lang === "JavaScript") return `for (let ${v} = ${start}; ${v} ${op} ${end}; ${v}${step.trim()}) {`;
    if (lang === "C++")        return `for (int ${v} = ${start}; ${v} ${op} ${end}; ${v}${step.trim()}) {`;
    if (lang === "C#")         return `for (int ${v} = ${start}; ${v} ${op} ${end}; ${v}${step.trim()})\n{`;
  }

  
  const forEach = line.match(/^for\s*\(\s*(\w+)\s+(\w+)\s*:\s*(\w+)\s*\)\s*\{?$/i);
  if (forEach) {
    const [, type, v, arr] = forEach;
    if (lang === "Python")     return `for ${v} in ${arr}:`;
    if (lang === "JavaScript") return `for (const ${v} of ${arr}) {`;
    if (lang === "C++")        return `for (${cppType(type)} ${v} : ${arr}) {`;
    if (lang === "C#")         return `foreach (${csType(type)} ${v} in ${arr})\n{`;
  }

  
  const whileLoop = line.match(/^while\s*\((.+)\)\s*\{?$/i);
  if (whileLoop) {
    const cond = convertCondition(whileLoop[1], lang);
    if (lang === "Python")     return `while ${cond}:`;
    if (lang === "JavaScript") return `while (${cond}) {`;
    if (lang === "C++")        return `while (${cond}) {`;
    if (lang === "C#")         return `while (${cond})\n{`;
  }

  const arrayDecl = line.match(/^(int|double|float|String|boolean|char)\s*\[\s*\]\s+(\w+)\s*=\s*new\s+\w+\[(.+)\]\s*;?$/i);
  if (arrayDecl) {
    const [, type, name, size] = arrayDecl;
    if (lang === "Python")     return `${name} = [None] * ${size}`;
    if (lang === "JavaScript") return `let ${name} = new Array(${size});`;
    if (lang === "C++")        return `${cppType(type)} ${name}[${size}];`;
    if (lang === "C#")         return `${csType(type)}[] ${name} = new ${csType(type)}[${size}];`;
  }

  const arrayInit = line.match(/^(int|double|float|String|boolean|char)\s*\[\s*\]\s+(\w+)\s*=\s*\{(.+)\}\s*;?$/i);
  if (arrayInit) {
    const [, type, name, vals] = arrayInit;
    if (lang === "Python")     return `${name} = [${vals}]`;
    if (lang === "JavaScript") return `let ${name} = [${vals}];`;
    if (lang === "C++")        return `${cppType(type)} ${name}[] = {${vals}};`;
    if (lang === "C#")         return `${csType(type)}[] ${name} = {${vals}};`;
  }

  
  const arrList = line.match(/^(?:ArrayList|List)<(\w+)>\s+(\w+)\s*=\s*new\s+ArrayList<.*?>\(\)\s*;?$/i);
  if (arrList) {
    const [, type, name] = arrList;
    if (lang === "Python")     return `${name} = []`;
    if (lang === "JavaScript") return `let ${name} = [];`;
    if (lang === "C++")        return `vector<${cppType(type)}> ${name};`;
    if (lang === "C#")         return `List<${csType(type)}> ${name} = new List<${csType(type)}>();`;
  }

  const varDecl = line.match(/^(?:final\s+)?(int|double|float|long|short|byte|String|boolean|char)\s+(\w+)\s*=\s*(.+);?$/i);
  if (varDecl) {
    const [, type, name, val] = varDecl;
    const isFinal = line.startsWith("final");
    const expr    = convertExpr(val.replace(/;$/, ""), lang);

    if (lang === "Python")     return `${name} = ${expr}`;
    if (lang === "JavaScript") return `${isFinal ? "const" : "let"} ${name} = ${expr};`;
    if (lang === "C++")        return `${isFinal ? "const " : ""}${cppType(type)} ${name} = ${expr};`;
    if (lang === "C#")         return `${isFinal ? "const " : ""}${csType(type)} ${name} = ${expr};`;
  }

  const varEmpty = line.match(/^(int|double|float|long|short|byte|String|boolean|char)\s+(\w+)\s*;?$/i);
  if (varEmpty) {
    const [, type, name] = varEmpty;
    if (lang === "Python")     return `${name} = None`;
    if (lang === "JavaScript") return `let ${name};`;
    if (lang === "C++")        return `${cppType(type)} ${name};`;
    if (lang === "C#")         return `${csType(type)} ${name};`;
  }

  const ret = line.match(/^return\s+(.*);?$/i);
  if (ret) {
    const val = convertExpr(ret[1].replace(/;$/, ""), lang);
    if (lang === "Python")     return `return ${val}`;
    if (lang === "JavaScript") return `return ${val};`;
    if (lang === "C++")        return `return ${val};`;
    if (lang === "C#")         return `return ${val};`;
  }

  if (/^\w+\+\+;?$/.test(line)) {
    const v = line.replace(/\+\+;?/, "");
    if (lang === "Python")     return `${v} += 1`;
    return line.endsWith(";") ? line : line + ";";
  }
  if (/^\w+--;?$/.test(line)) {
    const v = line.replace(/--;?/, "");
    if (lang === "Python")     return `${v} -= 1`;
    return line.endsWith(";") ? line : line + ";";
  }


  const assign = line.match(/^(\w+)\s*([+\-*\/]?=)\s*(.+);?$/);
  if (assign) {
    const val = convertExpr(assign[3].replace(/;$/, ""), lang);
    if (lang === "Python")     return `${assign[1]} ${assign[2]} ${val}`;
    return `${assign[1]} ${assign[2]} ${val};`;
  }

  
  return line;
}


function convertExpr(expr, lang) {
  let s = expr;

  
  if (lang === "Python") {
    s = s.replace(/\.toUpperCase\(\)/g, ".upper()")
         .replace(/\.toLowerCase\(\)/g, ".lower()")
         .replace(/\.trim\(\)/g, ".strip()")
         .replace(/\.length\(\)/g, ".__len__()")
         .replace(/\.length(?!\w)/g, ".__len__()")
         .replace(/\.equals\(([^)]+)\)/g, " == $1")
         .replace(/\.equalsIgnoreCase\(([^)]+)\)/g, ".lower() == ($1).lower()")
         .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
         .replace(/\.substring\(([^,]+),\s*([^)]+)\)/g, "[$1:$2]")
         .replace(/\.contains\(([^)]+)\)/g, ".__contains__($1)")
         .replace(/\.replace\(([^,]+),\s*([^)]+)\)/g, ".replace($1, $2)")
         .replace(/\.split\(([^)]+)\)/g, ".split($1)")
         .replace(/\.indexOf\(([^)]+)\)/g, ".index($1)")
         .replace(/\.add\(([^)]+)\)/g, ".append($1)")
         .replace(/\.size\(\)/g, ".__len__()")
         .replace(/\.get\(([^)]+)\)/g, "[$1]")
         .replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, "($1 ** $2)")
         .replace(/Math\.sqrt\(([^)]+)\)/g, "math.sqrt($1)")
         .replace(/Math\.abs\(([^)]+)\)/g, "abs($1)")
         .replace(/Math\.max\(([^)]+)\)/g, "max($1)")
         .replace(/Math\.min\(([^)]+)\)/g, "min($1)")
         .replace(/Math\.floor\(([^)]+)\)/g, "math.floor($1)")
         .replace(/Math\.ceil\(([^)]+)\)/g, "math.ceil($1)")
         .replace(/Math\.round\(([^)]+)\)/g, "round($1)")
         .replace(/Math\.PI/g, "math.pi")
         .replace(/Integer\.parseInt\(([^)]+)\)/g, "int($1)")
         .replace(/Double\.parseDouble\(([^)]+)\)/g, "float($1)")
         .replace(/String\.valueOf\(([^)]+)\)/g, "str($1)")
         .replace(/\(int\)\s*([^;,)\s]+)/g, "int($1)")
         .replace(/\(double\)\s*([^;,)\s]+)/g, "float($1)")
         .replace(/\bnew\s+ArrayList<.*?>\(\)/g, "[]")
         .replace(/\bnew\s+\w+\[([^\]]+)\]/g, "[None] * $1")
         .replace(/\btrue\b/g, "True")
         .replace(/\bfalse\b/g, "False")
         .replace(/\bnull\b/g, "None");
  } else if (lang === "JavaScript") {
    s = s.replace(/\.length\(\)/g, ".length")
         .replace(/\.equals\(([^)]+)\)/g, " === $1")
         .replace(/\.equalsIgnoreCase\(([^)]+)\)/g, ".toLowerCase() === ($1).toLowerCase()")
         .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
         .replace(/\.substring\(([^,]+),\s*([^)]+)\)/g, ".slice($1, $2)")
         .replace(/\.contains\(([^)]+)\)/g, ".includes($1)")
         .replace(/\.replace\(([^,]+),\s*([^)]+)\)/g, ".replace($1, $2)")
         .replace(/\.split\(([^)]+)\)/g, ".split($1)")
         .replace(/\.add\(([^)]+)\)/g, ".push($1)")
         .replace(/\.size\(\)/g, ".length")
         .replace(/\.get\(([^)]+)\)/g, "[$1]")
         .replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, "Math.pow($1, $2)")
         .replace(/Math\.sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
         .replace(/Math\.abs\(([^)]+)\)/g, "Math.abs($1)")
         .replace(/Math\.max\(([^)]+)\)/g, "Math.max($1)")
         .replace(/Math\.min\(([^)]+)\)/g, "Math.min($1)")
         .replace(/Math\.floor\(([^)]+)\)/g, "Math.floor($1)")
         .replace(/Math\.ceil\(([^)]+)\)/g, "Math.ceil($1)")
         .replace(/Math\.round\(([^)]+)\)/g, "Math.round($1)")
         .replace(/Integer\.parseInt\(([^)]+)\)/g, "parseInt($1)")
         .replace(/Double\.parseDouble\(([^)]+)\)/g, "parseFloat($1)")
         .replace(/String\.valueOf\(([^)]+)\)/g, "String($1)")
         .replace(/\(int\)\s*([^;,)\s]+)/g, "Math.trunc($1)")
         .replace(/\bnew\s+ArrayList<.*?>\(\)/g, "[]")
         .replace(/\bnew\s+\w+\[([^\]]+)\]/g, "new Array($1)");
  } else if (lang === "C++") {
    s = s.replace(/\.equals\(([^)]+)\)/g, " == $1")
         .replace(/\.length\(\)/g, ".length()")
         .replace(/\.length(?!\w)/g, ".length()")
         .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
         .replace(/\.substring\(([^,]+),\s*([^)]+)\)/g, ".substr($1, ($2)-($1))")
         .replace(/\.contains\(([^)]+)\)/g, ".find($1) != string::npos")
         .replace(/\.indexOf\(([^)]+)\)/g, ".find($1)")
         .replace(/\.toUpperCase\(\)/g, "")
         .replace(/\.toLowerCase\(\)/g, "")
         .replace(/\.add\(([^)]+)\)/g, ".push_back($1)")
         .replace(/\.size\(\)/g, ".size()")
         .replace(/\.get\(([^)]+)\)/g, "[$1]")
         .replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, "pow($1, $2)")
         .replace(/Math\.sqrt\(([^)]+)\)/g, "sqrt($1)")
         .replace(/Math\.abs\(([^)]+)\)/g, "abs($1)")
         .replace(/Math\.max\(([^)]+)\)/g, "max($1)")
         .replace(/Math\.min\(([^)]+)\)/g, "min($1)")
         .replace(/Math\.floor\(([^)]+)\)/g, "floor($1)")
         .replace(/Math\.ceil\(([^)]+)\)/g, "ceil($1)")
         .replace(/Math\.round\(([^)]+)\)/g, "round($1)")
         .replace(/Math\.PI/g, "M_PI")
         .replace(/Integer\.parseInt\(([^)]+)\)/g, "stoi($1)")
         .replace(/Double\.parseDouble\(([^)]+)\)/g, "stod($1)")
         .replace(/String\.valueOf\(([^)]+)\)/g, "to_string($1)")
         .replace(/\bString\b/g, "string")
         .replace(/\bboolean\b/g, "bool")
         .replace(/\bnull\b/g, "nullptr")
         .replace(/\bnew\s+ArrayList<.*?>\(\)/g, "{}");
  } else if (lang === "C#") {
    s = s.replace(/\.equals\(([^)]+)\)/g, " == $1")
         .replace(/\.equalsIgnoreCase\(([^)]+)\)/g, ".ToLower() == ($1).ToLower()")
         .replace(/\.toUpperCase\(\)/g, ".ToUpper()")
         .replace(/\.toLowerCase\(\)/g, ".ToLower()")
         .replace(/\.trim\(\)/g, ".Trim()")
         .replace(/\.length\(\)/g, ".Length")
         .replace(/\.length(?!\w)/g, ".Length")
         .replace(/\.charAt\(([^)]+)\)/g, "[$1]")
         .replace(/\.substring\(([^,]+),\s*([^)]+)\)/g, ".Substring($1, ($2)-($1))")
         .replace(/\.contains\(([^)]+)\)/g, ".Contains($1)")
         .replace(/\.replace\(([^,]+),\s*([^)]+)\)/g, ".Replace($1, $2)")
         .replace(/\.split\(([^)]+)\)/g, ".Split($1)")
         .replace(/\.indexOf\(([^)]+)\)/g, ".IndexOf($1)")
         .replace(/\.add\(([^)]+)\)/g, ".Add($1)")
         .replace(/\.size\(\)/g, ".Count")
         .replace(/\.get\(([^)]+)\)/g, "[$1]")
         .replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, "Math.Pow($1, $2)")
         .replace(/Math\.sqrt\(([^)]+)\)/g, "Math.Sqrt($1)")
         .replace(/Math\.abs\(([^)]+)\)/g, "Math.Abs($1)")
         .replace(/Math\.max\(([^)]+)\)/g, "Math.Max($1)")
         .replace(/Math\.min\(([^)]+)\)/g, "Math.Min($1)")
         .replace(/Math\.floor\(([^)]+)\)/g, "Math.Floor($1)")
         .replace(/Math\.ceil\(([^)]+)\)/g, "Math.Ceiling($1)")
         .replace(/Math\.round\(([^)]+)\)/g, "Math.Round($1)")
         .replace(/Math\.PI/g, "Math.PI")
         .replace(/Integer\.parseInt\(([^)]+)\)/g, "int.Parse($1)")
         .replace(/Double\.parseDouble\(([^)]+)\)/g, "double.Parse($1)")
         .replace(/String\.valueOf\(([^)]+)\)/g, "$1.ToString()")
         .replace(/\bString\b/g, "string")
         .replace(/\bboolean\b/g, "bool")
         .replace(/\bnull\b/g, "null")
         .replace(/\bnew\s+ArrayList<(.+?)>\(\)/g, "new List<$1>()");
  }

  return s;
}


function convertCondition(cond, lang) {
  let s = convertExpr(cond, lang);
  if (lang === "Python") {
    s = s.replace(/&&/g, " and ")
         .replace(/\|\|/g, " or ")
         .replace(/!/g, "not ")
         .replace(/\btrue\b/g, "True")
         .replace(/\bfalse\b/g, "False")
         .replace(/\bnull\b/g, "None");
  }
  return s;
}


function cppType(t) {
  const map = { String:"string", boolean:"bool", Integer:"int",
                Double:"double", Float:"float", Long:"long long" };
  return map[t] || t;
}

function csType(t) {
  const map = { String:"string", boolean:"bool", Integer:"int",
                Double:"double", Float:"float", Long:"long" };
  return map[t] || t;
}