import express from 'express';
import path from 'path';

require('babel-polyfill');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, 'app')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

app.listen(port);
