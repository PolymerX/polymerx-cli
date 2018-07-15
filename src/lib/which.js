import promisify from 'pify';
import which from 'which';

const pWhich = promisify(which);

export default async program => {
  const res = await pWhich(program);
  return Boolean(res);
};
