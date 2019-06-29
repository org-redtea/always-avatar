import bundle from '../letters/dist/bundle.json';

const min = Math.min;
const max = Math.max;

const WHITE = '#ffffff';
const DEFAULT_PALLET = ['#f8e7e7', WHITE];

export function getSVGGenerationData(sign: string): ({path: string, width: number, height: number})[] {
  const ln = sign.length;

  if (ln === 0) {
    return [];
  }

  let offset = 0, list = [];

  while (offset < ln) {
    list.push(bundle[sign[offset]]);
    offset++;
  }

  return list;
}


const palletCache = new Map();

export function getColorPalletCache(sign: string): string[] {
  const cached = palletCache.get(sign);

  if (cached) {
    return cached;
  }

  const pallet = getColorPallet(sign);

  palletCache.set(sign, pallet);

  return pallet;
}

export function getColorPallet(sign: string): string[] {
  if (sign.length === 1) {
    const code = sign.charCodeAt(0);
    const range = findRange(code);

    if (range) {
      const div = getDiv(code, range);
      const hsl = getHsl(div, div);

      return [hslToHex(hsl[0], hsl[1], hsl[2]), WHITE];
    }

  } else if (sign.length === 2) {
    const code0 = sign.charCodeAt(0);
    const code1 = sign.charCodeAt(1);
    const range0 = findRange(code0);
    const range1 = findRange(code1);

    if (range0 && range1) {
      const div0 = getDiv(code0, range0);
      const div1 = getDiv(code1, range1);
      const hsl = getHsl(div0, div1);

      return [hslToHex(hsl[0], hsl[1], hsl[2]), WHITE];
    }
  }

  return DEFAULT_PALLET;
}

const Hs = [
  24,
  210,
  357,
  106,
  300
];

function getHsl(a: number, b: number): number[] {
  return [
    Hs[Math.ceil((Hs.length - 1) * a)],
    55,
    75 + Math.floor(10 * b)
  ];
}

function getDiv(code: number, range: number[]): number {
  return (code - range[0]) / (range[1] - range[0]);
}

const signCache = new Map();

export function getSignCache(value?: string): string {
  const cached = signCache.get(value);

  if (cached) {
    return cached;
  }

  const sign = getSign(value);

  signCache.set(sign, sign);

  return sign;
}

const DELIMITERS = [' ', '-', '_'];

export function getSign(value?: string): string {
  if (
    typeof value === 'string'
    && value
  ) {
    const ln = value.length;

    let sign = '', offset = 0, addNext = true;

    while (offset < ln) {
      const char = value.charAt(offset);

      offset++;

      if (DELIMITERS.includes(char)) {
        addNext = true;
        continue;
      }

      if (!addNext) {
        continue;
      }

      const range = findRange(char.charCodeAt(0));

      if (range) {
        addNext = false;
        sign += char.toUpperCase();
      }

      if (sign.length === 2) {
        break;
      }
    }

    return sign;
  }

  return '';
}

const ranges = [
  // A-Z
  [0x41, 0x5A],
  // a-z
  [0x61, 0x7A],
  // А-Я
  [0x410, 0x42F],
  // а-я
  [0x430, 0x44F]
];

function findRange(charCode: number): number[] | void {
  return ranges.find(
    range => ((charCode >= range[0]) && (range[1] >= charCode))
  );
}

export function hslToHex(hue: number, saturation: number, luminosity: number): string {
  hue = cycle(hue);

  saturation = max(min(saturation, 100), 0);
  luminosity = max(min(luminosity, 100), 0);

  saturation = saturation / 100;
  luminosity = luminosity / 100;

  const rgb = hslToRgb(hue, saturation, luminosity);

  return '#' + rgb
    .map(function (n) {
      return (256 + n).toString(16).substr(-2)
    })
    .join('')
}

function cycle(val: number): number {
  val = min(val, 1e7);
  val = max(val, -1e7);

  while (val < 0) {
    val += 360;
  }

  while (val > 359) {
    val -= 360;
  }

  return val;
}

export function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
  const chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
  let huePrime = hue / 60;
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

  huePrime = Math.floor(huePrime);

  let red;
  let green;
  let blue;

  if (huePrime === 0) {
    red = chroma;
    green = secondComponent;
    blue = 0;
  } else if (huePrime === 1) {
    red = secondComponent;
    green = chroma;
    blue = 0;
  } else if (huePrime === 2) {
    red = 0;
    green = chroma;
    blue = secondComponent;
  } else if (huePrime === 3) {
    red = 0;
    green = secondComponent;
    blue = chroma;
  } else if (huePrime === 4) {
    red = secondComponent;
    green = 0;
    blue = chroma;
  } else if (huePrime === 5) {
    red = chroma;
    green = 0;
    blue = secondComponent;
  }

  const lightnessAdjustment = lightness - (chroma / 2);

  red += lightnessAdjustment;
  green += lightnessAdjustment;
  blue += lightnessAdjustment;

  return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
}

