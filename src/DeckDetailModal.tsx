import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Modal, List, Container } from "semantic-ui-react";
import "./App.css";
import { Result } from "./types";
import DeckList from "./DeckList";

interface DeckDetailModalProps {
    results: Result[];
    setResults(results: Result[]): void;
    open: boolean;
    onClose(): void;
}

const DeckDetailModal: React.FC<DeckDetailModalProps> = (props: DeckDetailModalProps) => {
    const { results, setResults, open, onClose } = props;
    const [displayedDeckIndex, setDisplayedDeckIndex] = useState<number>(0);

    const goToNextDeck = () => {
        if (!displayedDeck) return;
        const index = displayedDeckIndex || 0;

        const res = [...results];
        res[index] = displayedDeck;
        setResults(res);

        if (index + 1 < results.length) {
            setDisplayedDeckIndex(index + 1);
        } else {
            onClose();
        }
    };

    const goToPreviousDeck = () => {
        if (!displayedDeck) return;
        const index = displayedDeckIndex || 0;

        const res = [...results];
        res[index] = displayedDeck;
        setResults(res);

        if (index !== 0) {
            setDisplayedDeckIndex(index - 1);
        } else {
            onClose();
        }
    };

    const updateDisplayedDeck = (result: Result) => {
        const res = [...results];
        res[displayedDeckIndex] = result;
        setResults(res);
    };

    const displayedDeck = results[displayedDeckIndex];
    return (
        <Modal open={open} onClose={onClose} style={{ top: "3em", left: "calc(50vw - 475px)" }} closeOnDimmerClick={false} closeIcon>
            <Modal.Header>
                <Container textAlign="right">
                    <List horizontal>
                        <List.Item>
                            <Button onClick={goToPreviousDeck} content="Previous" />
                        </List.Item>
                        <List.Item>
                            <Button onClick={goToNextDeck} content="Next" />
                        </List.Item>
                    </List>
                </Container>
            </Modal.Header>
            <Modal.Content>
                {!!displayedDeck && <DeckList result={displayedDeck} updateDeck={updateDisplayedDeck} collapsible={false} goToNext={goToNextDeck} />}
            </Modal.Content>
        </Modal>
    );
};

export default DeckDetailModal;
