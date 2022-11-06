import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import OldApp from "./OldApp";
import NavBar from "./components/NavBar";
import About from "./components/About";
import { Container } from "semantic-ui-react";
import Archetypes from "./components/archetypes/Archetypes";
import { ScrapeResult } from "./types";
import ScraperForm from "./components/ScraperForm";

const App: React.FC = () => {
    const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([]);

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
                    <Route path="/decks">
                        <ScraperForm scrapeResults={scrapeResults} setScrapeResults={setScrapeResults} />
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
