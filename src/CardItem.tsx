import React from "react";
import { Card } from "./types";
import { List, Popup, Image } from "semantic-ui-react";

interface CardItemProps {
    card: Card;
    toggleCardHighlight(Card: Card): void;
}

const CardItem: React.FC<CardItemProps> = (props: CardItemProps) => {
    const { card, toggleCardHighlight } = props;

    return (
        <List.Item key={card.name} onClick={() => toggleCardHighlight(card)} className={card.highlighted ? "highlight" : ""}>
            <Popup
                basic
                mouseEnterDelay={700}
                mouseLeaveDelay={500}
                position="top center"
                trigger={
                    <p>
                        {card.count} {card.name}
                    </p>
                }
            >
                <Popup.Content>
                    {card.info && <Image src={`https://api.scryfall.com/cards/named?format=image&exact=${card.name.replaceAll(" ", "+")}`} />}
                </Popup.Content>
            </Popup>
        </List.Item>
    );
};

export default CardItem;
