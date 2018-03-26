import * as Bluebird from 'bluebird';

/**
 * @param { Bluebird } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Bluebird }
 */
export function to<T, U = any>(
  promise: Bluebird<T>,
  errorExt?: object,
): Bluebird<[U | null, T | undefined]> {
  return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, undefined]>(err => {
    if (errorExt) {
      Object.assign(err, errorExt);
    }

    return [err, undefined];
  });
}

export default to;
