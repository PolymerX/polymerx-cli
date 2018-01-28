const LOGO = `
      ██╗  ██╗
      ╚██╗██╔╝
       ╚███╔╝
       ██╔██╗
      ██╔╝ ██╗
      ╚═╝  ╚═╝
`.replace(/(^\n+|\n+$)/g, '');

const COLOR_CODE = 95;
const color = (color, text) =>
  `\u001b[${color}m\u001b[2m${text}\u001b[22m\u001b[39m`;

const textify = (logoASCII, text, useColor) => {
  const logo = logoASCII.split('\n');
  const words = text.split(' ');

  for (let i = 0; i < words.length; i++) {
    const index = words[i].indexOf('\n');
    if (~index) {
      words
        .splice(i, 1, words[i].substring(0, index), '\n', words[i].substring(index + 1));
      i += 2;
    }
  }

  const start = 21;
  const max = 50;
  const height = 5;
  let index = 0;

  while (words.length && index <= height) {
    let word = words.shift();
    let newlines = 0;

    if (!word) {
      continue;
    }

    if (word.match(/^\n/g)) {
      index += word.length - (word = word.replace(/^\n+/g, '')).length;
      words.unshift(word);
      continue;
    }

    if (word.match(/\n/)) {
      newlines = word.length - (word = word.replace(/\n/g, '')).length;
    }

    while (logo[index].length < start - 1) {
      logo[index] += ' ';
    }

    if (logo[index].length + 1 + word.length > max) {
      index++;
      words.unshift(word);
      continue;
    }

    logo[index] += ' ' + word;
    if (newlines) {
      index += newlines;
    }
  }

  if (useColor) {
    for (let index = 3; index <= height; index++) {
      logo[index] = color(
        COLOR_CODE, logo[index].substring(0, start)) + color(0, logo[index].substring(start)
      );
    }
  }

  return logo.join('\n');
};

export default (text, useColor = true) => {
  let logo = LOGO;

  if (text) {
    logo = textify(logo, text, useColor);
  }

  if (useColor) {
    logo = color(COLOR_CODE, logo);
  }

  return logo;
};
