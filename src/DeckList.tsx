import React, { ChangeEvent, useState, useEffect } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Header, Grid, Input, Button, List, Container, Icon } from 'semantic-ui-react'
import './App.css';
import { Result, Card } from './types'
import { Doughnut } from 'react-chartjs-2'
import CardItem from './CardItem'

interface DeckListProps {
    result: Result;
    goToNextDeck();
    goToPreviousDeck();
    setDisplayedDeck(Result: Result);
}

const colorLabels = [
    'White',
    'Blue',
    'Black',
    'Red',
    'Green',
    'Colorless'
]

const typeLabels = [
    'Creature',
    'Noncreature',
    'Land'
]


const colorColors = [
    '#fff8d6',
    '#367ae0',
    '#404040',
    '#db2e2e',
    '#187d2a',
    '#cfcfcf'
]

const typeColors = [
    '#8ba349',
    '#c48dc2',
    '#ffb114'
]


const DeckList: React.FC<DeckListProps> = (props: DeckListProps) => {
    const { result, goToNextDeck, goToPreviousDeck, setDisplayedDeck } = props;
    const [colorCount, setColorCount] = useState<number[]>([]);
    const [typeCount, setTypeCount] = useState<number[]>([]);

    const toggleCardHighlight = (card: Card) => {
        const { deck } = result
        for (const c of deck.maindeck) {
            if (c.name === card.name) {
                c.highlighted = !c.highlighted;
            }
        }
        for (const c of deck.sideboard) {
            if (c.name === card.name) {
                c.highlighted = !c.highlighted;
            }
        }
        setDisplayedDeck({ ...result, deck })
    }

    useEffect(() => {
        if (!result) return;
        let [wCount, uCount, bCount, rCount, gCount, cCount] = [0, 0, 0, 0, 0, 0];
        let [creatures, noncreatures, lands] = [0, 0, 0];

        for (const card of result.deck.maindeck) {
            if (card.info) {
                const { colors, types } = card.info;
                if (colors.includes("W")) wCount += card.count;
                if (colors.includes("U")) uCount += card.count;
                if (colors.includes("B")) bCount += card.count;
                if (colors.includes("R")) rCount += card.count;
                if (colors.includes("G")) gCount += card.count;
                if (!colors.length && !card.info.types.includes("Land")) cCount += card.count;

                if (types.includes("Creature")) creatures += card.count;
                else if (types.includes("Land")) lands += card.count;
                else noncreatures += card.count;
            }
        }
        setColorCount([wCount, uCount, bCount, rCount, gCount, cCount])
        setTypeCount([creatures, noncreatures, lands])
    }, [result]);

    const main: { [key: string]: JSX.Element[] } = {
        "Planeswalkers": [],
        "Creatures": [],
        "Instants": [],
        "Sorceries": [],
        "Artifacts": [],
        "Enchantments": [],
        "Lands": [],
        "Unknown": []
    }

    for (const card of result.deck.maindeck) {
        if (!card.info) {
            main.Unknown.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Creature")) {
            main.Creatures.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Land")) {
            main.Lands.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Instant")) {
            main.Instants.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Sorcery")) {
            main.Sorceries.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Artifact") && !card.info.types.includes("Creature")) {
            main.Artifacts.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Enchantment") && !card.info.types.includes("Creature")) {
            main.Enchantments.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Planeswalker")) {
            main.Planeswalkers.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
    }

    const side: { [key: string]: JSX.Element[] } = {
        "Companion": [],
        "Planeswalkers": [],
        "Creatures": [],
        "Instants": [],
        "Sorceries": [],
        "Artifacts": [],
        "Enchantments": [],
        "Lands": [],
        "Unknown": []
    }


    for (const card of result.deck.sideboard) {
        if (card.info && (!card.info.types || !card.info.text)) {
            console.log(card);
        }
        if (!card.info) {
            side.Unknown.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Creature")) {
            if (card.info.text && card.info.text.includes("Companion —")) {
                side.Companion.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />)
            }
            else {
                side.Creatures.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
            }
        }
        else if (card.info.types.includes("Land")) {
            side.Lands.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Instant")) {
            side.Instants.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Sorcery")) {
            side.Sorceries.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Artifact") && !card.info.types.includes("Creature")) {
            side.Artifacts.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Enchantment") && !card.info.types.includes("Creature")) {
            side.Enchantments.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
        else if (card.info.types.includes("Planeswalker")) {
            side.Planeswalkers.push(<CardItem card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
    }

    const handleSetArchetype = (e: ChangeEvent, data: any) => {
        const { value } = data
        setDisplayedDeck({ ...result, archetype: value })
    }

    const handleKeyPress = (e: any, data: any) => {
        if (e.key === 'Enter') {
            goToNextDeck();
        }
    }

    return (
        <Grid width={16} >
            <Grid.Row>
                <Grid.Column width={12}>
                    <Input label="Archetype" value={result.archetype} onChange={handleSetArchetype} onKeyPress={handleKeyPress} />
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button onClick={goToPreviousDeck} content="Previous" />
                </Grid.Column>
                <Grid.Column width={2}>
                    <Button onClick={goToNextDeck} content="Next" />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={5}>
                    <Header content="Maindeck" style={{ marginBottom: 0 }} />
                    <List style={{ marginTop: 0 }}>
                        <List.Item>
                            {Object.keys(main).map(
                                (key) => {
                                    if (!main[key].length) {
                                        return <></>;
                                    }
                                    return (
                                        <List.List key={key}>
                                            <List.Header content={key} />
                                            {main[key]}
                                        </List.List>)
                                }
                            )}
                        </List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column width={5}>
                    <Header content="Sideboard" style={{ marginBottom: 0 }} />
                    <List style={{ marginTop: 0 }}>
                        <List.Item>
                            {Object.keys(side).map(
                                (key) => {
                                    if (!side[key].length) {
                                        return <></>;
                                    }
                                    return (
                                        <List.List key={key}>
                                            <List.Header>
                                                {key === "Companion" && <Icon name="paw" />}
                                                {key}
                                                {key === "Companion" && <Icon name="paw" />}
                                            </List.Header>
                                            {side[key]}
                                        </List.List>)
                                }
                            )}
                        </List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column width={6}>
                    <Container style={{ marginBottom: "10px" }}>
                        <Doughnut
                            data={{ labels: colorLabels, datasets: [{ backgroundColor: colorColors, data: colorCount }] }}
                            options={{ title: { display: true, text: "Color Distribution" }, legend: { display: false } }}
                        />
                    </Container>
                    <Container>
                        <Doughnut
                            data={{
                                labels: typeLabels,
                                datasets: [
                                    { backgroundColor: typeColors, data: typeCount, label: "1" },
                                    { backgroundColor: typeColors.slice(0, 2), data: typeCount.slice(0, 2), label: "2" }
                                ]
                            }}
                            options={{ title: { display: true, text: "Type Distribution" }, legend: { display: true, position: "bottom" }, cutoutPercentage: 30 }}
                        />
                    </Container>
                </Grid.Column>
            </Grid.Row>
        </Grid >
    );
}

export default DeckList;
