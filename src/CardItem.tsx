import React from 'react';
import { Card } from './types'
import { Card as SemanticCard, List, Popup, Header } from 'semantic-ui-react';
import { Mana } from "@saeris/react-mana"


interface CardItemProps {
    card: Card;
    toggleCardHighlight(Card: Card);
}

const colorMap: { [key: string]: "blue" | "black" | "red" | "green" | "yellow" | "brown" | undefined } = {
    W: undefined,
    U: "blue",
    B: "black",
    R: "red",
    G: "green",
    M: "yellow",
    C: "brown"
}

const CardItem: React.FC<CardItemProps> = (props: CardItemProps) => {
    const { card, toggleCardHighlight } = props
    let cardColor: "blue" | "black" | "red" | "green" | "yellow" | "brown" | undefined;
    const costIcons: JSX.Element[] = []
    if (card.info) {
        const { colors, manaCost } = card.info
        switch (colors.length) {
            case 0:
                cardColor = colorMap["C"]
                break;
            case 1:
                cardColor = colorMap[colors[0]];
                break;
            default:
                cardColor = colorMap["M"]
                break;
        }
        if (manaCost) {
            const manaCostArray = manaCost.slice(1, manaCost.length - 1).split("}{");
            manaCostArray.forEach((pip, index) => {
                costIcons.push(<List.Item key={index} style={{ marginLeft: 2 }} content={<Mana symbol={pip.replace('/', '').toLowerCase()} shadow />} />)
            });
        }
    }

    return (
        <List.Item key={card.name} onClick={() => toggleCardHighlight(card)} className={card.highlighted ? 'highlight' : ''}>
            <Popup trigger={<p>{card.count} {card.name}</p>}>
                <Popup.Content>
                    {card.info &&
                        <SemanticCard
                            header={<Header>{card.name}<List horizontal items={costIcons} style={{ float: 'right' }} /></Header>}
                            meta={card.info.type}
                            description={card.info.text}
                            color={cardColor}
                        />
                        // <SemanticCard
                        //     header={<><Header>{card.name}</Header><List style={{ float: 'right' }} items={costIcons} /></>}
                        //     meta={card.info.type}
                        //     description={card.info.text}
                        //     color={cardColor}
                        // />
                    }
                </Popup.Content>
            </Popup>
        </List.Item>
    );
}

export default CardItem;