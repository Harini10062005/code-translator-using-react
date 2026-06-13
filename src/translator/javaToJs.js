export function javaToJs(code) {
  return code
    
    .replace(/System\.out\.println\((.*?)\);/g, "console.log($1);")
    .replace(/System\.out\.print\((.*?)\);/g,   "process.stdout.write($1);")

  
    .replace(/\b(int|double|float|long|short|byte)\s+(\w+)\s*=/g, "let $2 =")
    .replace(/\bString\s+(\w+)\s*=/g,  "let $1 =")
    .replace(/\bboolean\s+(\w+)\s*=/g, "let $1 =")
    .replace(/\bchar\s+(\w+)\s*=/g,    "let $1 =")

  
    .replace(/\b(int|double|float|String)\[\]\s+(\w+)\s*=\s*new\s+\w+\[\d+\];/g, "let $2 = [];")
    .replace(/\bnew\s+(int|double|float|String)\[\]/g, "")


    .replace(/\(int\)\s*/g,    "Math.trunc(")
    .replace(/\(double\)\s*/g, "Number(")
    .replace(/\(String\)\s*/g, "String(")

    .replace(/\.length\(\)/g,          ".length")
    .replace(/\.equals\((.*?)\)/g,     " === $1")
    .replace(/\.equalsIgnoreCase\((.*?)\)/g, ".toLowerCase() === ($1).toLowerCase()")
    .replace(/\.toUpperCase\(\)/g,     ".toUpperCase()")
    .replace(/\.toLowerCase\(\)/g,     ".toLowerCase()")
    .replace(/\.trim\(\)/g,            ".trim()")
    .replace(/\.charAt\((.*?)\)/g,     "[$1]")
    .replace(/\.substring\((.*?)\)/g,  ".slice($1)")
    .replace(/\.contains\((.*?)\)/g,   ".includes($1)")
    .replace(/\.replace\((.*?)\)/g,    ".replace($1)")
    .replace(/\.split\((.*?)\)/g,      ".split($1)")
    .replace(/\.indexOf\((.*?)\)/g,    ".indexOf($1)")

    .replace(/Math\.pow\((.*?),(.*?)\)/g,  "Math.pow($1,$2)")
    .replace(/Math\.sqrt\((.*?)\)/g,       "Math.sqrt($1)")
    .replace(/Math\.abs\((.*?)\)/g,        "Math.abs($1)")
    .replace(/Math\.max\((.*?)\)/g,        "Math.max($1)")
    .replace(/Math\.min\((.*?)\)/g,        "Math.min($1)")
    .replace(/Math\.floor\((.*?)\)/g,      "Math.floor($1)")
    .replace(/Math\.ceil\((.*?)\)/g,       "Math.ceil($1)")
    .replace(/Math\.round\((.*?)\)/g,      "Math.round($1)")

    .replace(/\b(public|private|protected)\s+static\s+void\s+main\s*\(String\[\]\s+args\)/g, "function main()")
    .replace(/\b(public|private|protected)\s+static\s+/g, "")
    .replace(/\b(public|private|protected)\s+/g,          "")
    .replace(/\bstatic\s+/g, "")
    .replace(/\bfinal\s+/g,  "const ")
    .replace(/\bvoid\s+(\w+)\s*\(/g, "function $1(")

    .replace(/\bclass\s+(\w+)\s*\{/g, "class $1 {")

    .replace(/for\s*\(\s*(int|long)\s+(\w+)\s*=\s*(.*?);\s*(.*?);\s*(.*?)\)/g, "for (let $2 = $3; $4; $5)")

    .replace(/\btrue\b/g,  "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/\bnull\b/g,  "null")

    .replace(/^import\s+.*?;$/gm, "")

    .trim();
}