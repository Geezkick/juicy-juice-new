import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf-8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const scriptRegex = /<script type="module">([\s\S]*?)<\/script>/;

const styleMatch = html.match(styleRegex);
if(styleMatch) {
  fs.mkdirSync('src', {recursive: true});
  fs.writeFileSync('src/style.css', styleMatch[1].trim() + '\n');
  html = html.replace(styleRegex, '<link rel="stylesheet" href="/src/style.css">');
}

const scriptMatch = html.match(scriptRegex);
if(scriptMatch) {
  fs.mkdirSync('src', {recursive: true});
  fs.writeFileSync('src/main.js', scriptMatch[1].trim() + '\n');
  html = html.replace(scriptRegex, '<script type="module" src="/src/main.js"></script>');
}

fs.writeFileSync('index.html', html);
console.log('Extraction complete');
