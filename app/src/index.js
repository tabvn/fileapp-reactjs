import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './css/app.css'

import Layout from './layout'

ReactDOM.render(<Layout />, document.getElementById('root'));
registerServiceWorker();
