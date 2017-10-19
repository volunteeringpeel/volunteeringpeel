import * as express from 'express';
import * as path from 'path';

import 'babel-polyfill';

const app = express();
const port = process.env.PORT || 19847;

app.use(express.static(path.resolve(__dirname, 'app')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

app.listen(port);
