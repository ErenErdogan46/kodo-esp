document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("runButton").addEventListener("click", runEsperantoCode);
    document.getElementById("editor").addEventListener("input", highlightEsperantoCode);
});

const keywords = { "estas": "ASSIGN", "plus": "ADD", "montru": "PRINT", "dum": "WHILE", "se": "IF" };

function lexer(code) {
    const tokens = [];
    const words = code.split(/\s+/);

    words.forEach(word => {
        if (!isNaN(word)) {  
            tokens.push(["NUMBER", Number(word)]);
        } else if (keywords[word]) {  
            tokens.push([keywords[word], word]);
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {  
            tokens.push(["IDENTIFIER", word]);
        } else {  
            tokens.push(["ERROR", word]);  
        }
    });

    return tokens;
}

function parser(tokens) {
    const ast = [];
    let i = 0;

    while (i < tokens.length) {
        const [type, value] = tokens[i];

        if (type === "IDENTIFIER" && i + 2 < tokens.length && tokens[i + 1][0] === "ASSIGN" && tokens[i + 2]) {
            ast.push(["ASSIGN", value, tokens[i + 2]]);
            i += 3;
        } else if (type === "PRINT" && i + 1 < tokens.length) {
            ast.push(["PRINT", tokens[i + 1]]);
            i += 2;
        } else {
            i++;
        }
    }

    return ast;
}

function interpreter(ast) {
    const variables = {};
    let output = "";

    ast.forEach(node => {
        if (node[0] === "ASSIGN") {
            variables[node[1]] = node[2][1];
        } else if (node[0] === "PRINT") {
            output += (variables[node[1][1]] || "Nedifinita") + "\n";
        }
    });

    document.getElementById("esperantoOutput").innerText = output;
}

function runEsperantoCode() {
    const codeElement = document.getElementById("editor");
    if (!codeElement) {
        console.error("Editor öğesi bulunamadı!");
        return;
    }
    const code = codeElement.innerText.trim();
    if (code === "") {
        document.getElementById("esperantoOutput").innerText = "Neniu kodo enmetita!";
        return;
    }

    const tokens = lexer(code);
    const ast = parser(tokens);
    interpreter(ast);
}

function highlightEsperantoCode() {
    const editor = document.getElementById("editor");
    let code = editor.innerText;
    let words = code.split(/\s+/);

    let highlightedHTML = words.map(word => {
        if (keywords[word]) {  
            return `<span class="keyword">${word}</span>`;
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {  
            return word;
        } else {  
            return `<span class="error">${word}</span>`;
        }
    }).join(" ");

    editor.innerHTML = highlightedHTML;
}
