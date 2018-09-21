
import getDevelopmentCertificate from 'devcert-san';
import chalk from 'chalk';

export default () => {
  console.log(chalk.blue('Setting up SSL certificate (may require sudo)...'));

  return getDevelopmentCertificate('polymerx-cli', {
    installCertutil: true
  }).catch(err => {
    console.log(chalk.red(`Failed to generate dev SSL certificate: ${err}`));
    return false;
  });
};
