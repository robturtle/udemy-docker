import React from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Home</Link>
          <Link to="/other-page">Other page</Link>
          <div>
            <Route exact path="/" component={Fib} />
            <Route path="/other-page" component={OtherPage} />
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
