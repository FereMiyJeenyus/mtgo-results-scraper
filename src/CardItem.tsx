import React from 'react';
import { Card } from './types'
import { Card as SemanticCard, List, Popup } from 'semantic-ui-react';


interface CardItemProps {
    card: Card;
    toggleCardHighlight(Card: Card);
}


const CardItem: React.FC<CardItemProps> = (props: CardItemProps) => {
    const { card, toggleCardHighlight } = props

    return (
        <List.Item key={card.name} onClick={() => toggleCardHighlight(card)} className={card.highlighted ? 'highlight' : ''}>
            <Popup trigger={<p>{card.count} {card.name}</p>}>
                <Popup.Content>
                    {card.info && <SemanticCard header={card.name} meta={card.info.type} description={card.info.text} />}
                </Popup.Content>
            </Popup>
        </List.Item>
    );
}

export default CardItem;