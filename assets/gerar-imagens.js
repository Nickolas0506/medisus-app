// Gera os PNGs do app a partir dos SVGs da identidade visual (rodar: node assets/gerar-imagens.js).
const path = require('path');
const sharp = require('sharp');

const svg = (nome) => path.join(__dirname, 'svg', nome);
const png = (nome) => path.join(__dirname, 'images', nome);

const saidas = [
  ['icone.svg', 'icon.png', 1024],
  ['icone-adaptativo.svg', 'adaptive-icon.png', 1024],
  ['logo.svg', 'splash-icon.png', 512],
  ['icone.svg', 'favicon.png', 64],
  ['logo.svg', 'logo.png', 512],
  ['receita.svg', 'ilustracao-receita.png', 900],
  ['vazio.svg', 'ilustracao-vazio.png', 900],
  ['ubs.svg', 'ilustracao-ubs.png', 900],
];

Promise.all(
  saidas.map(([origem, destino, largura]) =>
    sharp(svg(origem), { density: 300 }).resize({ width: largura }).png().toFile(png(destino))
  )
).then(() => console.log('Imagens geradas em assets/images'));
