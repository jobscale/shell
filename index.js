const { spawn, exec } = require('child_process');

const logger = console;

class Shell {
  exec(cmd) {
    const prom = {};
    prom.pending = new Promise((...args) => { [prom.resolve, prom.reject] = args; });
    exec(cmd, (e, stdout) => e ? prom.reject(e) : prom.resolve(stdout));
    return prom.pending;
  }
  spawn(command, params, options) {
    const prom = {};
    prom.pending = new Promise((...args) => { [prom.resolve, prom.reject] = args; });
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
      prom.resolve(result.join(''));
    });
    return prom.pending;
  }
}
module.exports = {
  Shell,
};
