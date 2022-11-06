import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Container, DropdownItemProps, Grid } from "semantic-ui-react";
import { Rule } from "../../types";

interface RuleFormProps {
    rule: Rule;
    index: number;
    updateRule(rule: Rule, index: number): void;
    removeRule(index: number): void;
    cardOptions: DropdownItemProps[];
}

const RuleForm: React.FC<RuleFormProps> = (props: RuleFormProps) => {
    const { rule, index, updateRule, removeRule, cardOptions } = props;

    return (
        <>
            <Grid.Column width={4}>
                {rule.cardName ? (
                    <Container>
                        Card Name
                        <br />
                        <strong style={{ display: "block", marginTop: "0.5em" }}>{rule.cardName}</strong>
                    </Container>
                ) : (
                    <Form.Dropdown
                        label="Card Name"
                        selection
                        search
                        lazyLoad
                        minCharacters={3}
                        value={rule.cardName}
                        options={cardOptions}
                        onChange={(_e, { value }) => {
                            updateRule({ ...rule, cardName: value as string }, index);
                        }}
                    />
                )}
            </Grid.Column>
            <Grid.Column width={2}>
                <Form.Dropdown
                    label="At Least"
                    fluid
                    selection
                    clearable
                    value={rule.atLeast}
                    options={[
                        { key: 1, text: 1, value: 1 },
                        { key: 2, text: 2, value: 2 },
                        { key: 3, text: 3, value: 3 },
                        { key: 4, text: 4, value: 4 }
                    ]}
                    onChange={(_e, { value }) => updateRule({ ...rule, atLeast: value !== "" ? (value as number) : undefined }, index)}
                />
            </Grid.Column>
            <Grid.Column width={2}>
                <Form.Dropdown
                    label="At Most"
                    fluid
                    selection
                    clearable
                    value={rule.atMost}
                    options={[
                        { key: 0, text: 0, value: 0 },
                        { key: 1, text: 1, value: 1 },
                        { key: 2, text: 2, value: 2 },
                        { key: 3, text: 3, value: 3 }
                    ]}
                    onChange={(_e, { value }) => updateRule({ ...rule, atMost: value !== "" ? (value as number) : undefined }, index)}
                />
            </Grid.Column>
            <Grid.Column width={3}>
                <Form.Dropdown
                    label="In"
                    fluid
                    selection
                    value={rule.in}
                    options={[
                        { key: 0, text: "Main", value: "main" },
                        { key: 1, text: "Sideboard", value: "side" },
                        { key: 2, text: "Either", value: "both" }
                    ]}
                    onChange={(_e, { value }) => updateRule({ ...rule, in: value as "main" | "side" | "both" }, index)}
                />
            </Grid.Column>
            <Grid.Column width={1} textAlign="right">
                <Button
                    style={{ marginTop: "1.4em" }}
                    icon="trash"
                    onClick={() => {
                        removeRule(index);
                    }}
                />
            </Grid.Column>
        </>
    );
};

export default RuleForm;
