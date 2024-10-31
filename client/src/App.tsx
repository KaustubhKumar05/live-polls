import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Create } from "./components/Create/index";
import { Attempt } from "./components/Attempt/index";
import { ToastContainer } from "react-toastify";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={Create} />
        <Route path="/quiz/:id" component={Attempt} />
      </Switch>
    </Router>
    <ToastContainer position="bottom-right" />
  </>
);

export default App;
