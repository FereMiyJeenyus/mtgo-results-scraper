import React from "react";
import "semantic-ui-css/semantic.min.css";
import { DropdownItemProps, Checkbox, Grid, Input, Button } from "semantic-ui-react";
import "./App.css";
import RuleForm from "./RuleForm";
import { Archetype, Rule } from "./types";

interface ArchetypeViewProps {
    archetype: Archetype;
    updateArchetype(archetype: Archetype): void;
    cardOptions: DropdownItemProps[];
}

const ArchetypeView: React.FC<ArchetypeViewProps> = (props: ArchetypeViewProps) => {
    const { archetype, updateArchetype, cardOptions } = props;

    const updateRule = (rule: Rule, index: number) => {
        const newRules = [...archetype.rules];
        newRules[index] = rule;
        updateArchetype({ ...archetype, rules: newRules });
    };

    const addRule = () => {
        const newRules = [...archetype.rules, { cardName: "", in: "main" } as Rule];
        updateArchetype({ ...archetype, rules: newRules });
    };

    const removeRule = (index: number) => {
        const newRules = [...archetype.rules];
        newRules.splice(index, 1);
        updateArchetype({ ...archetype, rules: newRules });
    };

    return (
        <Grid divided="vertically">
            <Grid.Row verticalAlign="middle">
                <Grid.Column width={4}>
                    <Input
                        value={archetype.name}
                        placeholder="Archetype Name"
                        onChange={(e) => {
                            updateArchetype({ ...archetype, name: e.target.value });
                        }}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Checkbox
                        toggle
                        label="Add Color Prefix?"
                        checked={archetype.prefixColors}
                        onChange={(e, { checked }) => {
                            updateArchetype({ ...archetype, prefixColors: checked });
                        }}
                    />
                </Grid.Column>
            </Grid.Row>

            {archetype.rules.map((r, i) => {
                return (
                    <Grid.Row key={r.cardName}>
                        <RuleForm rule={r} index={i} updateRule={updateRule} removeRule={removeRule} cardOptions={cardOptions} />
                    </Grid.Row>
                );
            })}
            <Grid.Row>
                <Grid.Column>
                    <Button icon="plus" content="Add Card Rule" onClick={addRule} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default ArchetypeView;
