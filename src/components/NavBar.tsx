import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Container, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
    const [path, setPath] = useState<string>(window.location.pathname);

    return (
        <Menu size="large">
            <Container>
                <Menu.Item as={Link} to={"/"} active={path === "/"} onClick={() => setPath("/")}>
                    Home
                </Menu.Item>
                <Menu.Item as={Link} to={"archetypes"} active={path === "/archetypes"} onClick={() => setPath("/archetypes")}>
                    Archetypes
                </Menu.Item>
                <Menu.Item as={Link} to={"decks"} active={path === "/decks"} onClick={() => setPath("/decks")}>
                    Decks
                </Menu.Item>
                <Menu.Item as={Link} to={"about"} active={path === "/about"} onClick={() => setPath("/about")}>
                    About
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default NavBar;
