import execa from 'execa';

export default (cwd, isYarn) => {
  const cmd = isYarn ? 'yarn' : 'npm';
  return execa(cmd, ['install'], {cwd}).catch(error => console.log(error));
};
