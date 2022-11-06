import React, { ChangeEvent, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Grid, Input, Button, Modal, Checkbox, InputOnChangeData } from "semantic-ui-react";
import "./App.css";
import { Result } from "../types";
import DeckList from "../DeckList";

interface DeckDetailModalProps {
    results: Result[];
    setResults(results: Result[]): void;
    open: boolean;
    onClose(): void;
}

const DeckDetailModal: React.FC<DeckDetailModalProps> = (props: DeckDetailModalProps) => {
    const { results, setResults, open, onClose } = props;
    const [displayedDeckIndex, setDisplayedDeckIndex] = useState<number>(0);
    const resultCount = results.length;

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

    const handleSetArchetype = (e: ChangeEvent, data: InputOnChangeData) => {
        const { value } = data;
        updateDisplayedDeck({ ...results[displayedDeckIndex], archetype: value });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            goToNextDeck();
        }
    };
    const displayedDeck = results[displayedDeckIndex];
    return (
        <Modal open={open} onClose={onClose} style={{ top: "3em", left: "calc(50vw - 475px)" }} closeOnDimmerClick={false} closeIcon>
            <Modal.Content>
                {!!displayedDeck && (
                    <Grid width={16}>
                        <Grid.Row className="decklist-header" verticalAlign="middle">
                            <Grid.Column width={4}>
                                <h3 style={{ marginBottom: "0.25em" }}>{displayedDeck.pilot}</h3>
                                <span>
                                    Deck {displayedDeck.id + 1} of {resultCount}
                                </span>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Input label="Archetype" value={displayedDeck.archetype} onChange={handleSetArchetype} onKeyPress={handleKeyPress} />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Checkbox
                                    checked={displayedDeck.favorite}
                                    label="Favorite?"
                                    onChange={() =>
                                        updateDisplayedDeck({
                                            ...displayedDeck,
                                            favorite: !displayedDeck.favorite
                                        })
                                    }
                                />
                                <Checkbox
                                    checked={displayedDeck.spicy}
                                    label="Spicy?"
                                    onChange={() =>
                                        updateDisplayedDeck({
                                            ...displayedDeck,
                                            spicy: !displayedDeck.spicy
                                        })
                                    }
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button onClick={goToPreviousDeck} content="Previous" />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Button onClick={goToNextDeck} content="Next" />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <DeckList result={displayedDeck} updateDeck={updateDisplayedDeck} />
                        </Grid.Row>
                    </Grid>
                )}
            </Modal.Content>
        </Modal>
    );
};

export default DeckDetailModal;
