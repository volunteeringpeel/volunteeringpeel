import * as React from 'react';
import * as ReactGA from 'react-ga';

ReactGA.initialize('UA-116051652-2');

// tslint:disable-next-line:variable-name
const withTracker = (WrappedComponent: React.ComponentClass, options = {}) => {
  const trackPage = (page: string) => {
    ReactGA.set({
      page,
      ...options,
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends React.Component<any> {
    public componentDidMount() {
      const page = this.props.location.pathname;
      trackPage(page);
    }

    public componentWillReceiveProps(nextProps: any) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    public render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};

export default withTracker;
