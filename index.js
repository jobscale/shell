require('core');
const { spawn, exec } = require('child_process');

class Shell {
  exec(cmd) {
    const { pending, resolve, reject } = promiseGen();
    exec(cmd, (e, stdout) => e ? reject(e) : resolve(stdout));
    return pending;
  }
  spawn(command, params, options) {
    const { pending, resolve } = promiseGen();
    const { res } = options || {};
    const result = [];
    const proc = spawn(command, params, Object.assign({ shell: true }, options));
    proc.stdout.on('data', data => {
      if (!res) result.push(data);
      else res.write(data);
      clearTimeout(this.timer);
      this.timer = setInterval(() => res.write(''), 60 * 1000);
    });
    proc.stderr.on('data', data => {
      logger.error(`stderr: ${data.toString()}`);
    });
    proc.on('close', code => {
      logger.info(`child process exited with code ${code}`);
      clearTimeout(this.timer);
      resolve(result.join(''));
    });
    return pending;
  }
}
module.exports = {
  Shell,
};
