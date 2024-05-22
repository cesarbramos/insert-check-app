export class Lexer {
    constructor() {
        this.tokens = [];
        this.current = 0;
        this.line = 1;
        this.column = 1;

        this.regex = /(^(start\s+transact|begin\s+work)\s*;\s*(insert\s+into\s+((?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*(?<metxhod>(\s*\(\s*(?:(?:[a-zA-Z_$])[0-9a-zA-Z$_]*|(?:[`]\d+[`])|["]\d+["]|(?:["][a-zA-Z_$])[0-9a-zA-Z$_]*["]|[`][a-zA-Z_$][0-9a-zA-Z$_]*[`])(?:\s*,\s*(?:[a-zA-Z_$])[0-9a-zA-Z$_]*|(?:[`]\d+[`])|["]\d+["]|(?:["][a-zA-Z_$])[0-9a-zA-Z$_]*["]|[`][a-zA-Z_$][0-9a-zA-Z$_]*[`])*\s*\)\s*values\s*\(\s*((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)(?:\s*,\s*(?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null))*)\s*\)\s*)|(set\s+(?<mxfields>(?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*=\s*(((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)))(,\s*(?<xmfields>(?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*=\s*(((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)))\s*)*));)(?:\s*(commit|rollback);))|(insert\s+into\s+((?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*(?<xmethod>(\s*\(\s*(?:(?:[a-zA-Z_$])[0-9a-zA-Z$_]*|(?:[`]\d+[`])|["]\d+["]|(?:["][a-zA-Z_$])[0-9a-zA-Z$_]*["]|[`][a-zA-Z_$][0-9a-zA-Z$_]*[`])(?:\s*,\s*(?:[a-zA-Z_$])[0-9a-zA-Z$_]*|(?:[`]\d+[`])|["]\d+["]|(?:["][a-zA-Z_$])[0-9a-zA-Z$_]*["]|[`][a-zA-Z_$][0-9a-zA-Z$_]*[`])*\s*\)\s*values\s*\(\s*((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)(?:\s*,\s*(?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null))*)\s*\)\s*)|(set\s+(?<mfields>(?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*=\s*(((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)))(,\s*(?<xfields>(?:[a-zA-Z_$])[0-9,a-z,A-Z$_]{0,63}|[`][a-zA-Z_$][0-9,a-z,A-Z$_]*[`])\s*=\s*(((?:'[^']*'|[+-]?\d+(?:\.\d+)?|true|false|null)))\s*)*));)/gi;
    }

    tokenize(input) {
        this.tokens = [];
        this.line = 1;
        this.column = 1;
        let match;

        while (input.length > 0) {
            match = this.regex.exec(input);
            if (match) {
                const token = match[0];
                const tokenInfo = {
                    value: token,
                    line: this.line,
                    column: this.column
                };
                this.tokens.push(tokenInfo);
                this.updatePosition(token);
                input = input.slice(token.length);
            } else {
                throw new Error(`Unexpected token at line ${this.line}, column ${this.column}: ${input}`);
            }
        }
    }

    updatePosition(token) {
        const lines = token.split('\n');
        if (lines.length > 1) {
            this.line += lines.length - 1;
            this.column = lines[lines.length - 1].length + 1;
        } else {
            this.column += token.length;
        }
    }

    nextToken() {
        if (this.current < this.tokens.length) {
            return this.tokens[this.current++];
        } else {
            return null;
        }
    }

    expectToken(expected) {
        const token = this.nextToken();
        const isArr = Array.isArray(expected);
        if (!token || (!isArr && token.value !== expected) 
            || isArr && expected.includes(token.value)) {
            throw new Error(`Se esperaba el token '${expected}' pero se encontró '${token ? token.value : 'null'}' en la línea ${token ? token.line : this.line}, columna ${token ? token.column : this.column}`);
        }
    }

    parse(input) {
        this.tokenize(input);
        // Continúa con las expectativas específicas de tu gramática...
        while (this.current < this.tokens.length) {
            const token = this.nextToken();
            console.log(`Token: ${token.value} (line ${token.line}, column ${token.column})`);
        }
    }
}
