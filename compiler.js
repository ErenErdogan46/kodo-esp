const keywords = {
    "estas": "ASSIGN",
    "plus": "ADD",
    "montru": "PRINT",
    "dum": "WHILE",
    "se": "IF"
};

function lexer(code) {
    const tokens = [];
    const words = code.split(/\s+/);
    
    words.forEach(word => {
        if (!isNaN(word)) {
            tokens.push(["NUMBER", Number(word)]);
        } else if (keywords[word]) {
            tokens.push([keywords[word], word]);
        } else {
            tokens.push(["IDENTIFIER", word]);
        }
    });

    return tokens;
}

function parser(tokens) {
    const ast = [];
    let i = 0;

    while (i < tokens.length) {
        const [type, value] = tokens[i];

        if (type === "IDENTIFIER" && i + 2 < tokens.length && tokens[i + 1][0] === "ASSIGN") {
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
            let varName = node[1][1];
            output += (varName in variables ? variables[varName] : "Nedifinita") + "\n";
        }
    });

    return output;
}

function runEsperantoCode() {
    const code = document.getElementById("esperantoCode").innerText;
    const tokens = lexer(code);
    const ast = parser(tokens);
    const output = interpreter(ast);

    document.getElementById("esperantoOutput").innerText = output;
}


function highlightCode() {
    const editor = document.getElementById("esperantoCode");
    let code = editor.innerText;
    
    code = code.replace(/\b(estas|montru|plus|dum|se)\b/g, '<span class="keyword">$1</span>');
    editor.innerHTML = code;
}


function checkErrors() {
    const editor = document.getElementById("esperantoCode");
    let words = editor.innerText.split(/\s+/);
    
    words = words.map(word => {
        if (!keywords[word] && isNaN(word) && word !== "") {
            return `<span class="error">${word}</span>`;
        }
        return word;
    });

    editor.innerHTML = words.join(" ");
}

document.addEventListener("DOMContentLoaded", function () {
    const editor = document.getElementById("esperantoCode");

    editor.addEventListener("input", function () {
        highlightCode();
        checkErrors();
    });
});
