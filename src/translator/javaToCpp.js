export function javaToCpp(code) {
  return code
    
    .replace(/^/, "#include <iostream>\n#include <string>\n#include <cmath>\nusing namespace std;\n\n")

  
    .replace(/System\.out\.println\((.*?)\);/g, "cout << $1 << endl;")
    .replace(/System\.out\.print\((.*?)\);/g,   "cout << $1;")

    
    .replace(/\bString\b/g,  "string")
    .replace(/\bboolean\b/g, "bool")

    
    .replace(/\btrue\b/g,  "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/\bnull\b/g,  "nullptr")

    
    .replace(/\.length\(\)/g,          ".length()")
    .replace(/\.toUpperCase\(\)/g,     "")
    .replace(/\.toLowerCase\(\)/g,     "")
    .replace(/\.equals\((.*?)\)/g,     " == $1")
    .replace(/\.trim\(\)/g,            "")
    .replace(/\.substring\((.*?),(.*?)\)/g, ".substr($1, $2 - $1)")
    .replace(/\.contains\((.*?)\)/g,   ".find($1) != string::npos")
    .replace(/\.charAt\((.*?)\)/g,     "[$1]")
    .replace(/\.replace\((.*?),(.*?)\)/g, "")
    .replace(/\.indexOf\((.*?)\)/g,    ".find($1)")

    
    .replace(/Math\.pow\((.*?),(.*?)\)/g,  "pow($1,$2)")
    .replace(/Math\.sqrt\((.*?)\)/g,       "sqrt($1)")
    .replace(/Math\.abs\((.*?)\)/g,        "abs($1)")
    .replace(/Math\.max\((.*?)\)/g,        "max($1)")
    .replace(/Math\.min\((.*?)\)/g,        "min($1)")
    .replace(/Math\.floor\((.*?)\)/g,      "floor($1)")
    .replace(/Math\.ceil\((.*?)\)/g,       "ceil($1)")
    .replace(/Math\.round\((.*?)\)/g,      "round($1)")

    
    .replace(/\b(public|private|protected)?\s*static\s+void\s+main\s*\(String\[\]\s+args\)/g, "int main()")

    
    .replace(/\b(public|private|protected)\s+static\s+/g, "")
    .replace(/\b(public|private|protected)\s+/g,          "")
    .replace(/\bstatic\s+/g, "")
    .replace(/\bfinal\s+/g,  "const ")

    
    .replace(/^import\s+.*?;$/gm, "")

    
    .replace(/^(\s*)\}(\s*)$/gm, (match, pre, post) => `${pre}}${post}`)

    .trim();
}