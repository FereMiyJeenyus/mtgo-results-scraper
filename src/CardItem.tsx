import React from "react";
import { Card } from "./types";
import { Card as SemanticCard, List, Popup } from "semantic-ui-react";
import { Mana } from "@saeris/react-mana";

interface CardItemProps {
    card: Card;
    toggleCardHighlight(Card: Card): void;
}

const colorMap: {
    [key: string]: "blue" | "black" | "red" | "green" | "yellow" | "brown" | undefined;
} = {
    W: undefined,
    U: "blue",
    B: "black",
    R: "red",
    G: "green",
    M: "yellow",
    C: "brown"
};

const CardItem: React.FC<CardItemProps> = (props: CardItemProps) => {
    const { card, toggleCardHighlight } = props;
    let cardColor: "blue" | "black" | "red" | "green" | "yellow" | "brown" | undefined;
    let otherHalfColor: "blue" | "black" | "red" | "green" | "yellow" | "brown" | undefined;
    const costIcons: React.ReactElement[] = [];
    if (card.info) {
        const { colors, manaCost } = card.info;
        switch (colors.length) {
            case 0:
                cardColor = colorMap["C"];
                break;
            case 1:
                cardColor = colorMap[colors[0]];
                break;
            default:
                cardColor = colorMap["M"];
                break;
        }
        if (card.info.otherHalf?.colors) {
            switch (card.info.otherHalf.colors.length) {
                case 0:
                    otherHalfColor = colorMap["C"];
                    break;
                case 1:
                    otherHalfColor = colorMap[colors[0]];
                    break;
                default:
                    otherHalfColor = colorMap["M"];
                    break;
            }
        }
        if (manaCost) {
            const manaCostArray = manaCost.slice(1, manaCost.length - 1).split("}{");
            manaCostArray.forEach((pip, index) => {
                costIcons.push(
                    <List.Item key={index} style={{ marginLeft: 2, paddingTop: 0 }} content={<Mana symbol={pip.replace("/", "").toLowerCase()} shadow />} />
                );
            });
        }
    }

    return (
        <List.Item key={card.name} onClick={() => toggleCardHighlight(card)} className={card.highlighted ? "highlight" : ""}>
            <Popup
                trigger={
                    <p>
                        {card.count} {card.name}
                    </p>
                }
            >
                <Popup.Content>
                    {card.info && (
                        <>
                            <SemanticCard color={cardColor}>
                                <SemanticCard.Content>
                                    <SemanticCard.Header>{card.name}</SemanticCard.Header>
                                    <SemanticCard.Meta>{card.info.type}</SemanticCard.Meta>
                                    <SemanticCard.Description style={{ whiteSpace: "pre-line" }}>{card.info.text}</SemanticCard.Description>
                                </SemanticCard.Content>
                                {(card.info.power || card.info.toughness) && (
                                    <SemanticCard.Content extra style={{ padding: ".25em 1em" }}>
                                        <div
                                            style={{
                                                float: "right",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {card.info.power}/{card.info.toughness}
                                        </div>
                                    </SemanticCard.Content>
                                )}
                            </SemanticCard>
                            {card.info.otherHalf && (
                                <SemanticCard color={otherHalfColor}>
                                    <SemanticCard.Content>
                                        <SemanticCard.Header>{card.info.otherHalf.faceName}</SemanticCard.Header>
                                        <SemanticCard.Meta>{card.info.otherHalf.type}</SemanticCard.Meta>
                                        <SemanticCard.Description style={{ whiteSpace: "pre-line" }}>{card.info.otherHalf.text}</SemanticCard.Description>
                                    </SemanticCard.Content>
                                    {(card.info.otherHalf.power || card.info.otherHalf.toughness) && (
                                        <SemanticCard.Content extra style={{ padding: ".25em 1em" }}>
                                            <div
                                                style={{
                                                    float: "right",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {card.info.power}/{card.info.toughness}
                                            </div>
                                        </SemanticCard.Content>
                                    )}
                                </SemanticCard>
                            )}
                        </>
                    )}
                </Popup.Content>
            </Popup>
        </List.Item>
    );
};

export default CardItem;
