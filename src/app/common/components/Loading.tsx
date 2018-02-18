import * as React from "react";
import { LoadingComponentProps } from "react-loadable";

import { store } from "@app/common/utilities";
import { loading } from "@app/public/actions";

export default class Loading extends React.Component<LoadingComponentProps> {
  public componentWillUnmount() {
    store.dispatch(loading(false));
  }

  public componentWillUpdate(nextProps: LoadingComponentProps) {
    if (this.props.pastDelay) {
      store.dispatch(loading(true));
    }
  }

  public render(): JSX.Element {
    return null;
  }
}