import React, { useState, useEffect, ChangeEvent } from "react";
import "semantic-ui-css/semantic.min.css";
import { Header, Grid, List, Container, Icon, Input, InputOnChangeData } from "semantic-ui-react";
import "./App.css";
import { Doughnut } from "react-chartjs-2";
import { Result, Card } from "./types";
import CardItem from "./CardItem";

interface DeckListProps {
    result: Result;
    collapsible?: boolean;
    updateDeck(result: Result): void;
    goToNext?(): void;
}

const colorLabels = ["White", "Blue", "Black", "Red", "Green", "Colorless"];

const typeLabels = ["Creature", "Noncreature", "Land"];

const colorColors = ["#fff8d6", "#367ae0", "#404040", "#db2e2e", "#187d2a", "#cfcfcf"];

const typeColors = ["#8ba349", "#c48dc2", "#ffb114"];

const DeckList: React.FC<DeckListProps> = (props: DeckListProps) => {
    const { result, updateDeck, goToNext, collapsible = true } = props;
    const [colorCount, setColorCount] = useState<number[]>([]);
    const [typeCount, setTypeCount] = useState<number[]>([]);
    const [collapsed, setCollapsed] = useState<boolean>(true);

    useEffect(() => {
        if (!result) return;
        let [wCount, uCount, bCount, rCount, gCount, cCount] = [0, 0, 0, 0, 0, 0];
        let [creatures, noncreatures, lands] = [0, 0, 0];

        result.deck.main.forEach((card) => {
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
        });
        setColorCount([wCount, uCount, bCount, rCount, gCount, cCount]);
        setTypeCount([creatures, noncreatures, lands]);
    }, [result]);

    const toggleCardHighlight = (card: Card) => {
        const mainIndex = result.deck.main.findIndex((c) => c.name === card.name);
        const sideIndex = result.deck.sideboard.findIndex((c) => c.name === card.name);
        const main = [...result.deck.main];
        const sideboard = [...result.deck.sideboard];
        if (mainIndex > -1) {
            main[mainIndex] = { ...main[mainIndex], highlighted: !main[mainIndex].highlighted };
        }
        if (sideIndex > -1) {
            sideboard[sideIndex] = { ...sideboard[sideIndex], highlighted: !sideboard[sideIndex].highlighted };
        }
        updateDeck({ ...result, deck: { main, sideboard } });
    };

    const toggleSpicy = () => {
        updateDeck({ ...result, spicy: !result.spicy });
    };

    const toggleFavorite = () => {
        updateDeck({ ...result, favorite: !result.favorite });
    };

    const handleSetArchetype = (e: ChangeEvent, data: InputOnChangeData) => {
        const { value } = data;
        updateDeck({ ...result, archetype: value });
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && !!goToNext) {
            goToNext();
        }
    };

    const main: { [key: string]: React.ReactElement[] } = {
        Planeswalkers: [],
        Creatures: [],
        Instants: [],
        Sorceries: [],
        Artifacts: [],
        Enchantments: [],
        Battles: [],
        Lands: [],
        Unknown: []
    };

    result.deck.main.forEach((card) => {
        if (!card.info) {
            main.Unknown.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Creature")) {
            main.Creatures.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Land")) {
            main.Lands.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Instant")) {
            main.Instants.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Sorcery")) {
            main.Sorceries.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Artifact") && !card.info.types.includes("Creature")) {
            main.Artifacts.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Enchantment") && !card.info.types.includes("Creature")) {
            main.Enchantments.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Planeswalker")) {
            main.Planeswalkers.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Battle")) {
            main.Battles.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
    });

    const side: { [key: string]: React.ReactElement[] } = {
        Companion: [],
        Planeswalkers: [],
        Creatures: [],
        Instants: [],
        Sorceries: [],
        Artifacts: [],
        Enchantments: [],
        Battles: [],
        Lands: [],
        Unknown: []
    };

    result.deck.sideboard.forEach((card) => {
        if (!card.info) {
            side.Unknown.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Creature")) {
            if (card.info.companion) {
                side.Companion.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
            } else {
                side.Creatures.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
            }
        } else if (card.info.types.includes("Land")) {
            side.Lands.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Instant")) {
            side.Instants.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Sorcery")) {
            side.Sorceries.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Artifact") && !card.info.types.includes("Creature")) {
            side.Artifacts.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Enchantment") && !card.info.types.includes("Creature")) {
            side.Enchantments.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Planeswalker")) {
            side.Planeswalkers.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        } else if (card.info.types.includes("Battle")) {
            main.Battles.push(<CardItem key={card.name} card={card} toggleCardHighlight={toggleCardHighlight} />);
        }
    });

    return (
        <Grid width={16} container centered className="decklist" padded>
            <Grid.Row className={result.archetype ? "decklist-header" : "decklist-header-unnamed"} verticalAlign="middle">
                <Grid.Column width={6} onClick={() => setCollapsed(!collapsed)}>
                    <Header style={{ marginBottom: 0 }}>
                        {collapsible && <Icon name={collapsed ? "triangle right" : "triangle down"} />}
                        {result.archetype ? `${result.archetype} | ` : ""}
                        {result.pilot}
                    </Header>
                </Grid.Column>
                <Grid.Column width={8} floated="right" textAlign="right">
                    <List horizontal>
                        <List.Item>
                            <Icon name="heart" size="big" color={result.favorite ? "pink" : "grey"} className="clickable" onClick={toggleFavorite} />
                        </List.Item>
                        <List.Item>
                            <Icon name="hotjar" size="big" color={result.spicy ? "orange" : "grey"} className="clickable" onClick={toggleSpicy} />
                        </List.Item>
                        <List.Item>
                            <Input label="Archetype" value={result.archetype} onChange={handleSetArchetype} onKeyPress={handleKeyPress} />
                        </List.Item>
                    </List>
                </Grid.Column>
            </Grid.Row>
            {(!collapsible || !collapsed) && (
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header content="Main" style={{ marginBottom: 0 }} />
                        <List style={{ marginTop: 0 }}>
                            <List.Item>
                                {Object.keys(main)
                                    .filter((key) => main[key].length)
                                    .map((key) => {
                                        return (
                                            <List.List key={key}>
                                                <List.Header content={key} />
                                                {main[key]}
                                            </List.List>
                                        );
                                    })}
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header content="Sideboard" style={{ marginBottom: 0 }} />
                        <List style={{ marginTop: 0 }}>
                            <List.Item>
                                {Object.keys(side)
                                    .filter((key) => side[key].length)
                                    .map((key) => {
                                        return (
                                            <List.List key={key}>
                                                <List.Header>
                                                    {key === "Companion" && <Icon name="paw" />}
                                                    {key} {key === "Companion" && <Icon name="paw" />}
                                                </List.Header>
                                                {side[key]}
                                            </List.List>
                                        );
                                    })}
                            </List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Container style={{ marginBottom: "10px" }}>
                            <Doughnut
                                data={{
                                    labels: colorLabels,
                                    datasets: [
                                        {
                                            backgroundColor: colorColors,
                                            data: colorCount
                                        }
                                    ]
                                }}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Color Distribution"
                                    },
                                    legend: { display: false }
                                }}
                            />
                        </Container>
                        <Container>
                            <Doughnut
                                data={{
                                    labels: typeLabels,
                                    datasets: [
                                        {
                                            backgroundColor: typeColors,
                                            data: typeCount,
                                            label: "1"
                                        },
                                        {
                                            backgroundColor: typeColors.slice(0, 2),
                                            data: typeCount.slice(0, 2),
                                            label: "2"
                                        }
                                    ]
                                }}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Type Distribution"
                                    },
                                    legend: { display: true, position: "bottom" },
                                    cutoutPercentage: 30
                                }}
                            />
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            )}
        </Grid>
    );
};

export default DeckList;
