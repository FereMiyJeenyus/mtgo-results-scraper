import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Container, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
    const [path, setPath] = useState<string>(window.location.pathname);

    return (
        <Menu size="large">
            <Container>
                <Menu.Item as={Link} to={"mtgo-results-scraper"} active={path === "/mtgo-results-scraper"} onClick={() => setPath("/mtgo-results-scraper")}>
                    Home
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to={"mtgo-results-scraper/archetypes"}
                    active={path === "/mtgo-results-scraper/archetypes"}
                    onClick={() => setPath("/mtgo-results-scraper/archetypes")}
                >
                    Archetypes
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to={"mtgo-results-scraper/mass-entry"}
                    active={path === "/mtgo-results-scraper/mass-entry"}
                    onClick={() => setPath("/mtgo-results-scraper/mass-entry")}
                >
                    Mass Entry
                </Menu.Item>
                <Menu.Item
                    as={Link}
                    to={"mtgo-results-scraper/about"}
                    active={path === "/mtgo-results-scraper/about"}
                    onClick={() => setPath("/mtgo-results-scraper/about")}
                >
                    About
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default NavBar;
