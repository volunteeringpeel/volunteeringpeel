import * as React from 'react';

/**
 * Exactly the same as the React component class but has an asynchronous setState
 */
export default class AsyncComponent<P, S> extends React.Component<P, S> {
  public async setState<K extends keyof S>(state: Pick<S, K> | S | null) {
    return new Promise(resolve => {
      super.setState(state, resolve);
    });
  }
}
