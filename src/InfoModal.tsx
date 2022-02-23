import React from "react";
import "semantic-ui-css/semantic.min.css";
import { List, Container, Modal, ListItem } from "semantic-ui-react";
import "./App.css";

interface InfoModalProps {
    open: boolean;
    onClose(): void;
}

const InfoModal: React.FC<InfoModalProps> = (props: InfoModalProps) => {
    const { open, onClose } = props;

    return (
        <Modal open={open} centered={false} onClose={onClose} closeOnDimmerClick={true} closeIcon>
            <Modal.Content>
                <List>
                    <List.Item>
                        <List.Header>What am I looking at?</List.Header>
                        <Container style={{ padding: "0.5em 1.25em 0.25em" }}>
                            This is a web tool for scraping Wizards of the Coast&apos;s MTGO results posts and formatting the contents for a Reddit post (or
                            anywhere else that supports Markdown)
                        </Container>
                    </List.Item>
                    <List.Item>
                        <List.Header>How do I use it?</List.Header>
                        <Container style={{ paddingLeft: "1em" }}>
                            <List ordered>
                                <ListItem>Paste the url for a WotC deck dump in the little box and click &apos;Scrape.&apos;</ListItem>
                                <ListItem>
                                    Click &apos;Decks&apos; to view the decklists. From there, you can enter the archetype names and click cards to highlight
                                    them.
                                </ListItem>
                                <ListItem>
                                    Copy the resulting text into your Reddit post. Be sure you&apos;re in &apos;Markdown Mode&apos; or your links will get ugly.
                                </ListItem>
                            </List>
                        </Container>
                    </List.Item>
                    <List.Item>
                        <List.Header>How can I report a bug or suggest a feature?</List.Header>
                        <Container style={{ padding: "0.5em 1.25em " }}>
                            Message me on Reddit: <a href="https://reddit.com/message/compose/?to=FereMiyJeenyus">/u/FereMiyJeenyus</a>
                        </Container>
                    </List.Item>
                </List>
            </Modal.Content>
        </Modal>
    );
};

export default InfoModal;
