export function javaToCsharp(code) {
  return code
    
    .replace(/System\.out\.println\((.*?)\);/g, "Console.WriteLine($1);")
    .replace(/System\.out\.print\((.*?)\);/g,   "Console.Write($1);")

    
    .replace(/\bString\b/g, "string")
    .replace(/\bboolean\b/g, "bool")

    
    .replace(/\btrue\b/g,  "true")
    .replace(/\bfalse\b/g, "false")
    .replace(/\bnull\b/g,  "null")

  
    .replace(/\.equals\((.*?)\)/g,              " == $1")
    .replace(/\.equalsIgnoreCase\((.*?)\)/g,    ".ToLower() == ($1).ToLower()")
    .replace(/\.toUpperCase\(\)/g,              ".ToUpper()")
    .replace(/\.toLowerCase\(\)/g,              ".ToLower()")
    .replace(/\.trim\(\)/g,                     ".Trim()")
    .replace(/\.length\(\)/g,                   ".Length")
    .replace(/\.charAt\((.*?)\)/g,              "[$1]")
    .replace(/\.substring\((.*?),(.*?)\)/g,     ".Substring($1, $2 - $1)")
    .replace(/\.contains\((.*?)\)/g,            ".Contains($1)")
    .replace(/\.replace\((.*?),(.*?)\)/g,       ".Replace($1,$2)")
    .replace(/\.split\((.*?)\)/g,               ".Split($1)")
    .replace(/\.indexOf\((.*?)\)/g,             ".IndexOf($1)")
    .replace(/\.toCharArray\(\)/g,              ".ToCharArray()")

    
    .replace(/Math\.pow\((.*?),(.*?)\)/g,  "Math.Pow($1,$2)")
    .replace(/Math\.sqrt\((.*?)\)/g,       "Math.Sqrt($1)")
    .replace(/Math\.abs\((.*?)\)/g,        "Math.Abs($1)")
    .replace(/Math\.max\((.*?)\)/g,        "Math.Max($1)")
    .replace(/Math\.min\((.*?)\)/g,        "Math.Min($1)")
    .replace(/Math\.floor\((.*?)\)/g,      "Math.Floor($1)")
    .replace(/Math\.ceil\((.*?)\)/g,       "Math.Ceiling($1)")
    .replace(/Math\.round\((.*?)\)/g,      "Math.Round($1)")

    
    .replace(/\b(public|private|protected)?\s*static\s+void\s+main\s*\(String\[\]\s+args\)/g,
      "static void Main(string[] args)")

  
    .replace(/\bfinal\s+/g, "const ")

    
    .replace(/^import\s+java\.util\.(\w+);$/gm, "using System.Collections.Generic;")
    .replace(/^import\s+.*?;$/gm, "")

    .trim();
}