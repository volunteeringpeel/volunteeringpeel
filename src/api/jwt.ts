/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import { JWTPayload } from '../custom';

export const client = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksUri: 'https://volunteering-peel.auth0.com/.well-known/jwks.json',
});

const asyncSigningKey = Bluebird.promisify(client.getSigningKey, { context: client });

export const getSigningKey = async (kid: string): Promise<string> => {
  let err, key;
  [err, key] = await to(asyncSigningKey(kid));
  if (err) throw err;
  return (key as jwksRsa.CertSigningKey).publicKey || (key as jwksRsa.RsaSigningKey).rsaPublicKey;
};

export const verify = async (token: string): Promise<JWTPayload> => {
  const decoded = jwt.decode(token, { complete: true });
  const kid = decoded.header.kid;
  let err, key;
  [err, key] = await to(Bluebird.resolve(getSigningKey(kid)));
  if (err) throw err;

  return Promise.resolve(
    jwt.verify(token, key, {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://volunteering-peel.auth0.com/`,
    }),
  );
};
