const express = require('express');

const app = express();
const PORT = process.env.PORT || 9999;

app.use(express.static('public'));

app.get('/', (req, res) => {

  if ('healthz' in req.query) {
    return res.status(200).send('✅ Probe OK: /?healthz');
  }

  res.status(200).send('Hello, World! Is there anyone out there???');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK - health');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('healthz probe OK direct');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Main app running at http://localhost:${PORT}`);
});
