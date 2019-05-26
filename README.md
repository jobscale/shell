## install

```
npm i -S jobscale/shell
```

## example

```
const { Shell } = require('shell');

const main = () => {
  new Shell().spawn('curl', ['ifconfig.io'])
  .then(() => logger.info(text));
};
(() => {
  main();
})();
```
