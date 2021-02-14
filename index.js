require('core');
const { spawn, exec } = require('child_process');

class Shell {
  promise() {
    const promise = {};
    promise.suspend = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  }
  exec(cmd) {
    const promise = promiseGen();
    exec(cmd, (e, stdout) => e ? promise.reject(e) : promise.resolve(stdout));
    return promise.instance;
  }
  spawn(command, params, options) {
    const { suspend, resolve } = this.promise();
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
    return suspend;
  }
}
module.exports = {
  Shell,
};
