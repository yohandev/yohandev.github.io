import { render } from "preact";
import { createHashHistory } from "history";
import Router from "preact-router";

import { Home } from "./views/home";
import { Watch } from "./views/watch";

const App = () => (
    <Router history={createHashHistory()}>
        <Home path="/"/>
        <Watch path="/watch/:id?"/>
    </Router>
);

render(<App/>, document.body);