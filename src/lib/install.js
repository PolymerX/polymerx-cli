import execa from 'execa';

export default (cwd, isYarn) => {
  const cmd = isYarn ? 'yarn' : 'npm';
  const endCmd = process.platform === 'win32' ? `${cmd}.cmd` : cmd;
  return execa(endCmd, ['install'], {cwd, stdio: 'ignore'});
};
