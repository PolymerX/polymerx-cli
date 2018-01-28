
/* eslint-disable unicorn/no-process-exit */

const done = (err, result) => {
  return err ?
    process.stderr.write(String(err) + '\n') &&
    process.exit(err.exitCode || 1) :
    result ? process.stdout.write(result + '\n') : process.exit(0);
};

export default function asyncCommand(options) {
  return {
    ...options,
    handler(argv) {
      const r = options.handler ? options.handler(argv, done) : undefined;
      if (r && r.then) {
        return r.then(result => done(null, result));
      }
    }
  };
}
