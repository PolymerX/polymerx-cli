module.exports = (toRemove = []) => [{
  name: 'template',
  message: 'Remote template to clone (user/repo#tag)',
  type: 'input',
  default: undefined
}, {
  name: 'dest',
  message: 'Directory to create the app',
  type: 'input',
  default: undefined
},
{
  name: 'name',
  message: 'The application\'s name',
  type: 'input',
  default: undefined
},
{
  name: 'force',
  message: 'Enforce `dest` directory; will overwrite!',
  type: 'confirm',
  default: false
},
{
  name: 'yarn',
  message: 'Install with `yarn` instead of `npm`',
  type: 'confirm',
  default: false
},
{
  name: 'git',
  message: 'Initialize a `git` repository',
  type: 'confirm',
  default: false
},
{
  name: 'install',
  message: 'Install dependencies',
  type: 'confirm',
  default: true
}
].filter(option => !toRemove.includes(option.name));
