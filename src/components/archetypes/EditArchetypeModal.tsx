import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import ArchetypeView from "./ArchetypeView";
import { Archetype } from "../../types";
import cardInfo from "../../resources/cardInfo.json";

interface EditArchetypeModalProps {
    open: boolean;
    onClose(): void;
    archetype?: Archetype;
    updateArchetype(archetype: Archetype): void;
}
const cardOptions = Object.keys(cardInfo).map((card) => ({ key: card, text: card, value: card }));

const EditArchetypeModal: React.FC<EditArchetypeModalProps> = (props: EditArchetypeModalProps) => {
    const { archetype, updateArchetype, open, onClose } = props;
    const [localArchetype, setLocalArchetype] = useState<Archetype>();

    useEffect(() => {
        if (!archetype) return;
        setLocalArchetype({ ...archetype } || { id: 999, name: "", rules: [] });
    }, [archetype]);

    const handleSave = () => {
        if (localArchetype) {
            updateArchetype(localArchetype);
        }
        setLocalArchetype(undefined);
        onClose();
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Modal.Content>
                {localArchetype && <ArchetypeView archetype={localArchetype} updateArchetype={setLocalArchetype} cardOptions={cardOptions} />}
            </Modal.Content>
            <Modal.Actions>
                <Button content="Save" onClick={handleSave} />
                <Button content="Cancel" onClick={onClose} />
            </Modal.Actions>
        </Modal>
    );
};

export default EditArchetypeModal;
