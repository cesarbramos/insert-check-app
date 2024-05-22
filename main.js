import './style.css'
import { Lexer } from './lexer.js'

const btn = document.getElementById('prove');
const errorContainer = document.getElementById('message');
const textArea = document.getElementById('code');

btn.onclick = (_e) => {
  console.log(textArea);
  check(textArea?.value);
}

const check = (text) => {
  try {
    const lexer = new Lexer();
    lexer.parse(text);
    showMessage('Validación correcta.')
  } catch(err) {
    console.log({err});
    showError(err);
  }
}

const showError = (err) => {
  errorContainer.className = 'error';
  errorContainer.innerHTML = err;
}

const showMessage = (msg) => {
  errorContainer.className = 'ok';
  errorContainer.innerHTML = msg;
}