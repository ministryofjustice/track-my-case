const express = require('express');

const app = express();
const APP_PORT = 3000;

app.use(express.static('public'));

app.listen(APP_PORT, '0.0.0.0', () => {
  console.log(`Main app running at http://localhost:${APP_PORT}`);
});

app.get('/', (req, res) => {
  res.status(200).send('Hello, World! Is there anyone out there?');
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});
app.get('/healthz', (_req, res) => {
  res.status(200).send('healthz::: is OK 2');
});
