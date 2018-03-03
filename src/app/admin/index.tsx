// Library Imports
import * as moment from 'moment';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import reactWidgetsMoment from 'react-widgets-moment';

// App Imports
import '@app/css/style.less';

// Components Imports
import AdminApp from '@app/admin/AdminApp';

moment.locale('en');
reactWidgetsMoment();

ReactDOM.render(<AdminApp />, document.getElementById('app'));
