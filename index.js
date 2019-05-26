require('core');
const { spawn, exec } = require('child_process');

class Shell {
  exec(cmd) {
    const promise = promiseGen();
    exec(cmd, (e, stdout) => e ? promise.reject(e) : promise.resolve(stdout));
    return promise.instance;
  }
  spawn(command, params, options) {
    const promise = promiseGen();
    const proc = spawn(command, params, Object.assign({ shell: true }, options));
    proc.stdout.on('data', data => promise.resolve(data.toString()));
    return promise.instance;
  }
}
module.exports = {
  Shell,
};
