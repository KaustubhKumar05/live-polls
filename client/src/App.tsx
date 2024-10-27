import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import "./styles/index.css";
import { Create } from "./components/Create/index";
import { Attempt } from "./components/Attempt/index";

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create" component={Create} />
      <Route path="/quiz/:id" component={Attempt} />
    </Switch>
  </Router>
);

export default App;
