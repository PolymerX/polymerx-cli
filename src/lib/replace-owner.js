
import replace from 'replace-in-file';

export default (keeps, name, author) => {
  const dict = new Map();
  ['name', 'short_name'].forEach(str => {
    dict.set(new RegExp(`"${str}": ".+"`, 'g'), `"${str}": "${name}"`);
  });

  /* eslint-disable-next-line prefer-regex-literals */
  dict.set(new RegExp('"author": ".+"', 'g'), `"author": "${author}"`);

  for (const entry of keeps) {
    dict.forEach((v, regex) => {
      replace.sync({
        files: entry,
        from: regex,
        to: v
      });
    });
  }
};
