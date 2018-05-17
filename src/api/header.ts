/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as mv from 'mv';

// API Imports
import * as Utilities from '@api/utilities';

const readdir = Bluebird.promisify(fs.readdir);
const unlink = Bluebird.promisify(fs.unlink);

export const getHeaderImage = Utilities.asyncMiddleware(async (req, res) => {
  req.db.release();
  // Get list of images inside of header folder
  const [err, images] = await to(readdir(global.appDir + '/upload/header'));
  if (err) res.error(500, 'Error picking a header image', err);
  const randomImage = Math.floor(Math.random() * images.length);
  res.status(200).sendFile(global.appDir + '/upload/header/' + images[randomImage]);
});

export const listHeaderImages = Utilities.asyncMiddleware(async (req, res) => {
  const [err, images] = await to(readdir(global.appDir + '/upload/header'));
  if (err) res.error(500, 'Error loading header images', err);
  res.success(images);
});

export const deleteHeaderImage = Utilities.asyncMiddleware(async (req, res) => {
  const [err] = await to(unlink(global.appDir + '/upload/header/' + req.params.filename));
  if (err) res.error(500, 'Error deleting header image', err);
  res.success('Image deleted successfully');
});

export const uploadHeaderImage = Utilities.asyncMiddleware(async (req, res) => {
  if (!req.file) res.error(422, 'No file found');
  const [err] = await to(
    Bluebird.promisify(mv)(req.file.path, `${global.appDir}/upload/header/${req.file.filename}`),
  );
  if (err) return res.error(500, 'Failed to save uploaded file', err);
  res.success('Image uploaded successfully');
});
