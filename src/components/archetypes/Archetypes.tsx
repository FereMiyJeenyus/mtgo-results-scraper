import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Header, Container, List, Ref, Modal, Form, Message } from "semantic-ui-react";
import { Archetype } from "../../types";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import EditArchetypeModal from "./EditArchetypeModal";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

// const formatDropdownOptions = [
//     { key: "modern", text: "Modern", value: "modern" },
//     { key: "pioneer", text: "Pioneer", value: "pioneer" },
//     { key: "legacy", text: "Legacy", value: "legacy" },
//     { key: "vintage", text: "Vintage", value: "vintage" },
//     { key: "standard", text: "Standard", value: "standard" }
// ];

const ArchetypePage: React.FC = () => {
    const [archetypeRules, setArchetypeRules] = useState<Archetype[]>([]);
    const [selectedArchetype, setSelectedArchetype] = useState<Archetype>();
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
    const [exportString, setExportString] = useState<string>("");
    const [importError, setImportError] = useState<boolean>(false);

    useEffect(() => {
        const rulesFromStorage = window.localStorage?.getItem("archetypeRules");
        if (rulesFromStorage && rulesFromStorage !== "undefined") {
            setArchetypeRules(JSON.parse(rulesFromStorage));
        }
    }, []);

    useEffect(() => {
        const str = JSON.stringify(archetypeRules);
        window.localStorage?.setItem("archetypeRules", str);
        setExportString(str);
    }, [archetypeRules]);

    useEffect(() => {
        setImportError(false);
    }, [exportModalOpen]);

    const updateArchetype = (archetype: Archetype) => {
        const newArchetypes = [...archetypeRules];
        const index = archetypeRules.findIndex((a) => a.id === archetype.id);
        if (index > -1) newArchetypes[index] = archetype;
        else newArchetypes.push(archetype);
        setArchetypeRules(newArchetypes);
    };

    const addArchetype = () => {
        let id = 0;
        archetypeRules.forEach((a) => {
            if (a.id > id) id = a.id;
        });
        setEditModalOpen(true);
        setSelectedArchetype({ id: id + 1, name: "", rules: [] });
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(archetypeRules, result.source.index, result.destination.index);

        setArchetypeRules(items);
    };

    const handleDeleteClick = (archetype: Archetype) => {
        const newArchetypes = [...archetypeRules];
        const index = newArchetypes.findIndex((a) => a.id === archetype.id);
        if (index > -1) {
            newArchetypes.splice(index, 1);
        }
        setArchetypeRules(newArchetypes);
    };

    const handleEditClick = (archetype: Archetype) => {
        setSelectedArchetype(archetype);
        setEditModalOpen(true);
    };

    const onEditModalClose = () => {
        setEditModalOpen(false);
    };

    const saveFromString = () => {
        try {
            setImportError(false);
            const rules = JSON.parse(exportString);
            setArchetypeRules(rules);
            setExportModalOpen(false);
        } catch (error) {
            setImportError(true);
            console.error(error);
        }
    };

    return (
        <Container>
            <Header as="h2">Archetype Definitions</Header>
            <Message compact content="Tip: You can drag to reorder the archetypes!" />
            <Container>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <Ref innerRef={provided.innerRef}>
                                <List divided verticalAlign="middle" {...provided.droppableProps}>
                                    {archetypeRules.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id?.toString()} index={index}>
                                            {(provided) => (
                                                <Ref innerRef={provided.innerRef}>
                                                    <List.Item {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <List.Content floated="right">
                                                            <Button content="Delete" onClick={() => handleDeleteClick(item)} />
                                                        </List.Content>
                                                        <List.Content floated="right">
                                                            <Button content="Edit" onClick={() => handleEditClick(item)} />
                                                        </List.Content>
                                                        <List.Content verticalAlign="middle">
                                                            <Header>{item.name}</Header>
                                                        </List.Content>
                                                    </List.Item>
                                                </Ref>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            </Ref>
                        )}
                    </Droppable>
                </DragDropContext>
            </Container>
            <Button icon="plus" content="Create New Archetype Definition" floated="left" onClick={() => addArchetype()} />
            <Button color="blue" content="Import/Export" onClick={() => setExportModalOpen(true)} />
            <EditArchetypeModal open={editModalOpen} onClose={onEditModalClose} archetype={selectedArchetype} updateArchetype={updateArchetype} />
            <Modal open={exportModalOpen} onClose={() => setExportModalOpen(false)}>
                <Modal.Content>
                    <Message
                        content="Copy the text below into pastebin or a text file to make sure you don't lose your archetype rules if you clear your browser's
                        local storage, then paste it here to restore them."
                    />
                    {importError && <Message error content="Failed to parse input! Reach out to me (FereMiyJeenyus) and I'll try to correct it." />}
                    <Form>
                        <Form.TextArea value={exportString} style={{ height: 500 }} onChange={(_e, { value }) => setExportString(value as string)} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content="Close without Saving" icon="x" onClick={() => setExportModalOpen(false)} />
                    <Button content="Save & Close" icon="checkmark" onClick={saveFromString} positive />
                </Modal.Actions>
            </Modal>
        </Container>
    );
};

export default ArchetypePage;
