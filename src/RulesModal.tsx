import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Modal, Accordion, Icon, Button } from "semantic-ui-react";
import "./App.css";
import ArchetypeView from "./ArchetypeView";
import { Archetype } from "./types";
import cardInfo from "./resources/cardInfo.json";

interface RulesModalProps {
    open: boolean;
    onClose(refresh: boolean): void;
    archetypeRules: Archetype[];
    setArchetypeRules(archetypes: Archetype[]): void;
}

const cardOptions = Object.keys(cardInfo).map((card) => ({ key: card, text: card, value: card }));

const RulesModal: React.FC<RulesModalProps> = (props: RulesModalProps) => {
    const { open, onClose, archetypeRules, setArchetypeRules } = props;
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const updateArchetype = (archetype: Archetype) => {
        const newArchetypes = [...archetypeRules];
        const index = archetypeRules.findIndex((a) => a.id === archetype.id);
        newArchetypes[index] = archetype;
        setArchetypeRules(newArchetypes);
    };

    const addArchetype = () => {
        setArchetypeRules([...archetypeRules, { id: archetypeRules.length + 1, name: "", rules: [] }]);
    };

    return (
        <Modal open={open} onClose={() => onClose(false)} closeIcon style={{ top: "3em", left: "calc(50vw - 475px)" }}>
            <Modal.Header>Archetype Definitions (this is super beta, let me know if anything breaks)</Modal.Header>
            <Modal.Content>
                <Accordion>
                    {archetypeRules.map((archetype, i) => {
                        return (
                            <>
                                <Accordion.Title
                                    key={`${archetype.id}-title`}
                                    active={activeIndex === i}
                                    index={i}
                                    onClick={() => {
                                        setActiveIndex(activeIndex !== i ? i : -1);
                                    }}
                                >
                                    <Icon name="dropdown" />
                                    <span>{archetype.name}</span>
                                    <div className="accordion-title-line" />
                                </Accordion.Title>
                                <Accordion.Content key={`${archetype.id}-content`} active={activeIndex === i}>
                                    <ArchetypeView archetype={archetype} updateArchetype={updateArchetype} cardOptions={cardOptions} />
                                </Accordion.Content>
                            </>
                        );
                    })}
                </Accordion>
            </Modal.Content>
            <Modal.Actions>
                <Button icon="plus" content="Create New Archetype Definition" floated="left" onClick={() => addArchetype()} />
                <Button color="blue" content="Save and Apply" onClick={() => onClose(true)} />
            </Modal.Actions>
        </Modal>
    );
};

export default RulesModal;
