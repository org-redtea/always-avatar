const {JSDOM} = require('jsdom');
const svgpath = require('svgpath');
const getBounds = require('svg-path-bounds');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const SOURCE = path.resolve(__dirname, './source/');
const DIST = path.resolve(__dirname, './dist/');
const DIST_PREVIEW = path.resolve(__dirname, './dist-preview/');

main();

function main() {
  const bundle = createBundle(SOURCE);

  prepareDir(DIST);
  prepareDir(DIST_PREVIEW);

  writeBundleAsJSON(DIST, bundle);
  generateSVGPreview(DIST_PREVIEW, bundle);
}

function prepareDir(dist) {
  rimraf.sync(dist);
  fs.mkdirSync(dist, {recursive: true});
}

function generateSVGPreview(dist, bundle) {
  const entries = Object.entries(bundle);

  for (const [letter, data] of entries) {
    const body = generateSvg(letter, data);

    fs.writeFileSync(path.resolve(dist, `./${letter}.svg`), body, 'utf8');
  }
}

function generateSvg(letter, data) {
  // language=SVG
  return (
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${data.width}" height="${data.height}"  viewBox="0 0 ${data.width} ${data.height}">`
    + `<path d="${data.path}"></path>`
    + `</svg>`
  );
}

function writeBundleAsJSON(dist, bundle) {
  const json = JSON.stringify(bundle, null, 2);
  fs.writeFileSync(path.resolve(dist, './bundle.json'), json, 'utf8');
}

function createBundle(_path) {
  const letters = getSourceLetters(_path);
  const bundle = {};

  for (const letter of letters) {
    bundle[letter.letter] = getLetterDataFromSvg(letter.content);
  }

  return bundle;
}

function getSourceLetters(_path) {
  const files = fs.readdirSync(_path)
    .map(file => path.resolve(SOURCE, file));
  return files.map(getLetter);
}

function getLetter(_path) {
  const content = fs.readFileSync(_path, 'utf8');
  const parsedPath = path.parse(_path);
  const [number, letter] = parsedPath.name.split('-');

  return {
    content,
    number,
    letter
  };
}

function getLetterDataFromSvg(svg) {
  const dom = new JSDOM(svg);
  const svgEl = dom.window.document
    .querySelector('svg');
  const pathEl = dom.window.document
    .querySelector('path');
  const path = pathEl.getAttribute('d');
  const width = svgEl.getAttribute('width');
  const height = svgEl.getAttribute('height');

  return {
    path,
    width: parseFloat(width),
    height: parseFloat(height)
  };
}
