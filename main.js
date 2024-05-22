import './style.css'
import { parseSQL } from './moo.js'

const btn = document.getElementById('prove');
const errorContainer = document.getElementById('message');
const textArea = document.getElementById('code');

btn.onclick = (_e) => {
  console.log(textArea);
  check(textArea?.value);
}

const check = (_e) => {
  try {
    parseSQL(textArea?.value)
    showMessage('Validación correcta.')
  } catch(err) {
    console.log({err});
    showError(err.message);
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
