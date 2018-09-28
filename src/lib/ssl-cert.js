
import getDevelopmentCertificate from 'devcert-san';
import chalk from 'chalk';

export default () => {
  console.log(chalk.blue('Setting up SSL certificate (may require sudo)...'));

  return getDevelopmentCertificate('preact-cli', {
    installCertutil: true
  }).catch(error => {
    console.log(chalk.red(`Failed to generate dev SSL certificate: ${error}`));
    return false;
  });
};
