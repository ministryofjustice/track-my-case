const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.status(200).send('Hello, World! Is there anyone out there???');
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('healthz::: is OK 2');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Main app running at http://localhost:${PORT}`);
});