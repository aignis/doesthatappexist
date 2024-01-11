const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.post('/api/parse-app', async (req, res) => {
    const { appUrl } = req.body;

    try {
      const response = await axios.get(appUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      const scriptTag = doc.querySelector('script[type="application/ld+json"]');
      const jsonContent = JSON.parse(scriptTag.textContent);

      const appData = {
        title: jsonContent.name || 'N/A',
        description: jsonContent.description || 'N/A',
      };

      // Save appData to your database or any other desired action
      // For simplicity, we are just sending the data back to the client
      res.status(200).json(appData);
    } catch (error) {
      console.error('Error parsing app data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

