// tslint:disable:no-var-requires
// Library Imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// App Imports
import '@app/css/style.less';

require('@app/robots.txt');
require('@app/sitemap.xml');

// Components Imports
import PublicApp from '@app/public/PublicApp';

ReactDOM.render(<PublicApp />, document.getElementById('app'));
