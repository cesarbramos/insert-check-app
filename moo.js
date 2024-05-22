import * as moo from 'moo'

let lexer = moo.compile({
    WS: { match: /[ \s]+/, lineBreaks: true },
    number: /0|[1-9][0-9]*/,
    string: /'(?:\\['\\]|[^\n'\\])*'/,  // Maneja cadenas de texto entre comillas simples
    lparen: '(',
    rparen: ')',
    comma: ',',
    semi: ';',
    keyword: ['INSERT', 'INTO', 'VALUES', 'SET', 'COMMIT', 'ROLLBACK', 'START', 'TRANSACT', 'BEGIN', 'WORK'],
    identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*|[`][a-zA-Z_$][a-zA-Z0-9_$]*[`]/,  // Identificadores para nombres de tabla y columnas
    equals: '='
});

export function parseSQL(input) {
    lexer.reset(input);
    let token;
    let expecting = ['INSERT', 'START', 'BEGIN'];
    let lastToken = null;

    while (token = lexer.next()) {
        console.log(token);
        if (token.type === 'WS') continue;  // Ignora los espacios en blanco

        console.log({ token, lastToken });

        if ((token.type != 'keyword' && !expecting.includes(token.type))
            || token.type == 'keyword' && !expecting.includes(token.type) && !expecting.includes(token.value.toUpperCase())) {
            throw new Error(`Syntax error: Unexpected token '${token.value}' at line ${token.line}, col ${token.col}. Expected: ${expecting.join(', ')}`);
        }

        const comparator = token.type == 'keyword' ? token.value : token.type;
        switch (comparator.toUpperCase()) {
            case 'START':
                expecting = ['TRANSACT'];
                break;
            case 'TRANSACT':
                expecting = ['semi'];
                break;
            case 'BEGIN':
                expecting = ['WORK'];
                break;
            case 'INSERT':
                expecting = ['INTO'];
                break;
            case 'INTO':
                expecting = ['identifier'];
                break;
            case 'VALUES':
                expecting = ['lparen'];
                break;
            case 'LPAREN':
                if (lastToken && lastToken.value.toUpperCase() === 'VALUES') {
                    expecting = ['string', 'number'];  // Espera valores después de 'VALUES'
                } else {
                    expecting = ['identifier'];  // Espera identificadores de columna después de '('
                }
                break;
            case 'RPAREN':
                if (lastToken && lastToken.type.toUpperCase() === 'IDENTIFIER') {
                    expecting = ['comma', 'VALUES'];  // Después de nombres de columna, espera 'VALUES' o ','
                } else {
                    expecting = ['comma', 'semi'];  // Cierra paréntesis de VALUES
                }
                break;
            case 'COMMA':
                if (lastToken && lastToken.type === 'RPAREN') {
                    expecting = ['identifier'];  // Después de cerrar paréntesis, espera otro identificador o 'VALUES'
                } else {
                    expecting = ['string', 'number', 'identifier'];  // Dentro de paréntesis para columnas o valores
                }
                break;
            case 'SEMI':
                if (lastToken && ['TRANSACT', 'WORK'].includes(lastToken.value.toUpperCase())) {
                    expecting = ['INSERT']
                } else {
                    expecting = [];  // Fin de la instrucción
                }
                break;
            case 'SET':
                expecting = ['identifier'];
                break;
            case 'IDENTIFIER':
                console.log({lastToken});
                if (lastToken && lastToken.value.toUpperCase() === 'INTO') {
                    expecting = ['lparen', 'SET'];  // Después de 'INTO', espera '('
                } else if (lastToken && lastToken.type.toUpperCase() === 'LPAREN') {
                    expecting = ['comma', 'rparen'];  // Permitir identificador o cerrar paréntesis
                } else if (lastToken && lastToken.type === 'COMMA') {
                    expecting = ['identifier'];  // Permitir otro identificador después de una coma
                } else {
                    expecting = ['comma', 'rparen', 'SET'];
                }
                break;
            case 'STRING':
            case 'NUMBER':
                expecting = ['comma', 'rparen'];
                break;
            case 'EQUALS':
                expecting = ['string', 'number']
                break;
            }


        lastToken = token;
    }

    if (expecting.length > 0) {
        if ((lastToken.type != 'keyword' && !expecting.includes(lastToken.type))
            || lastToken.type == 'keyword' && !expecting.includes(lastToken.type) && !expecting.includes(lastToken.value.toUpperCase())) {
            throw new Error(`Syntax error: Unexpected token '${lastToken.value}' at line ${lastToken.line}, col ${lastToken.col}. Expected: ${expecting.join(', ')}`);
        }
    }
    
}
