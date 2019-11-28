import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Homepage from './Homepage';
import * as serviceWorker from './serviceWorker';
import Switch from "react-bootstrap/cjs/Switch";
import Route from "react-router-dom/es/Route";
import { BrowserRouter as Router } from 'react-router-dom';

const routing = (
    <Router>
        <div>
            <Switch>
                <Route path="/" component={App} />
                <Route path="/homepage" component={Homepage} />
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(<Homepage/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
