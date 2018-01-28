import promisify from 'pify';
import which from 'which';

const pWhich = promisify(which);

export default program => pWhich(program).then(res => Boolean(res));
