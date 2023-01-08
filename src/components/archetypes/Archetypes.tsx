import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Header, Dropdown, Container, List, Ref, Modal } from "semantic-ui-react";
import { Archetype, Metagame } from "../../types";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import EditArchetypeModal from "./EditArchetypeModal";

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const formatDropdownOptions = [
    { key: "modern", text: "Modern", value: "modern" },
    { key: "pioneer", text: "Pioneer", value: "pioneer" },
    { key: "legacy", text: "Legacy", value: "legacy" },
    { key: "vintage", text: "Vintage", value: "vintage" },
    { key: "standard", text: "Standard", value: "standard" }
];

const ArchetypePage: React.FC = () => {
    const [archetypeRules, setArchetypeRules] = useState<Archetype[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string>("");
    const [selectedArchetype, setSelectedArchetype] = useState<Archetype>();
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [oldArchetypeModalOpen, setOldArchetypeModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const rulesFromStorage = window.localStorage?.getItem("archetypeRules");
        if (rulesFromStorage && rulesFromStorage !== "undefined") {
            setArchetypeRules(JSON.parse(rulesFromStorage));
        }
    }, []);

    useEffect(() => {
        window.localStorage?.setItem("archetypeRules", JSON.stringify(archetypeRules));
    }, [archetypeRules]);

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

    return (
        <Container>
            <Header>Archetype Definitions (this is super beta, let me know if anything breaks)</Header>
            <Dropdown
                selection
                placeholder="Select a format..."
                options={formatDropdownOptions}
                value={selectedFormat}
                onChange={(e, data) => setSelectedFormat(data.value as string)}
            />
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
            <Button icon="plus" content="Create New Archetype Definition" floated="left" onClick={() => addArchetype()} />
            <Button color="blue" content="Save and Apply" />
            <EditArchetypeModal open={editModalOpen} onClose={onEditModalClose} archetype={selectedArchetype} updateArchetype={updateArchetype} />
            <Modal open={oldArchetypeModalOpen} onClose={() => setOldArchetypeModalOpen(false)}></Modal>
        </Container>
    );
};

export default ArchetypePage;
