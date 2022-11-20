import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import OldApp from "./OldApp";
import NavBar from "./components/NavBar";
import About from "./components/About";
import { Container } from "semantic-ui-react";
import Archetypes from "./components/archetypes/Archetypes";
import ScraperForm from "./components/ScraperForm";

const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <Container>
                <Switch>
                    <Route path="/archetypes">
                        <Archetypes />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/mass-entry">
                        <ScraperForm />
                    </Route>
                    <Route path="/">
                        <OldApp />
                    </Route>
                </Switch>
            </Container>
        </Router>
    );
};

export default App;
