import React, { useState, useCallback, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Header, Container, Grid, Input, Button, Form, Message, Tab, List, DropdownItemProps, Accordion, Icon, Dimmer, Loader } from "semantic-ui-react";
import "./App.css";
import { getDecksFromUrl } from "./scraper";
import { Result, Deck, setList, Card, CardCount, Rule, Archetype, guildMap, shardMap } from "./types";
import DeckDetailModal from "./DeckDetailModal";
import InfoModal from "./InfoModal";
import RulesModal from "./RulesModal";

export type TextFormat = "plaintext" | "markdown";
const thx = `Direct links courtesy of /u/FereMiyJeenyus and their [MTGO Results Scraper](https://feremiyjeenyus.github.io/mtgo-results-scraper/)`;

const App: React.FC = () => {
    const [hasScraped, setHasScraped] = useState<boolean>(false);
    const [wotcUrl, setWotcUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultList, setResultList] = useState<Result[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [cardCounts, setCardCounts] = useState<CardCount[]>([]);
    const [selectedExpansions, setSelectedExpansions] = useState<string[]>([]);
    const [deckModalOpen, setDeckModalOpen] = useState<boolean>(false);
    const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
    const [scrapeError, setScrapeError] = useState<boolean>(false);
    const [isNumberedResults, setIsNumberedResults] = useState<boolean>(false);
    const [expandOptions, setExpandOptions] = useState<boolean>(false);
    const [textFormat, setTextFormat] = useState<TextFormat>("markdown");
    const [filterForSpice, setFilterForSpice] = useState<boolean>(false);
    const [filterForFave, setFilterForFave] = useState<boolean>(false);
    const [rulesModalOpen, setRulesModalOpen] = useState<boolean>(false);
    const [cardOptions, setCardOptions] = useState<DropdownItemProps[]>([]);
    const [showReprints, setShowReprints] = useState<boolean>(true);

    const [archetypeRules, setArchetypeRules] = useState<Archetype[]>([]);

    useEffect(() => {
        const rulesFromStorage = window.localStorage?.getItem("archetypeRules");
        if (rulesFromStorage && rulesFromStorage !== "undefined") {
            setArchetypeRules(JSON.parse(rulesFromStorage));
        }
    }, []);

    useEffect(() => {
        window.localStorage?.setItem("archetypeRules", JSON.stringify(archetypeRules));
    }, [archetypeRules]);

    // scraping
    const generateCardCounts = (results: Result[]) => {
        const counts: CardCount[] = [];
        results.forEach((r) => {
            r.deck.main.forEach((card) => {
                const countRow = counts.find((c) => c.card.name === card.name);
                if (!countRow) {
                    counts.push({
                        card: { ...card, highlighted: false },
                        deckCount: 1
                    });
                } else {
                    countRow.card.count += card.count;
                    countRow.deckCount++;
                }
            });

            r.deck.sideboard.forEach((card) => {
                const countRow = counts.find((c) => c.card.name === card.name);
                if (!countRow) {
                    counts.push({
                        card: { ...card, highlighted: false },
                        deckCount: 1
                    });
                } else {
                    countRow.card.count += card.count;
                    if (!r.deck.main.find((c) => c.name === card.name)) {
                        countRow.deckCount++;
                    }
                }
            });
        });

        setCardOptions(
            counts
                .sort((a, b) => {
                    if (a.card.name < b.card.name) return -1;
                    if (b.card.name < a.card.name) return 1;
                    return 0;
                })
                .map((c) => ({
                    key: c.card.name,
                    text: c.card.name,
                    value: c.card.name
                }))
        );
        setCardCounts(counts);
    };

    const deckFitsRule = (deck: Card[], rule: Rule) => {
        const { cardName, atMost, atLeast } = rule;
        return (
            (atMost === 0 && !deck.some((c) => c.name === cardName)) ||
            deck.some((c) => c.name === cardName && (!atLeast || c.count >= atLeast) && (!atMost || c.count <= atMost))
        );
    };

    const identifyArchetype = useCallback(
        (result: Result): Result => {
            const { deck } = result;
            //lazy clone the card objects because we add the sideboard counts
            const combinedCards = deck.main.map((c) => ({ ...c }));
            deck.sideboard.forEach((card) => {
                const mb = combinedCards.find((c) => c.name === card.name);
                if (!mb) {
                    combinedCards.push(card);
                } else {
                    mb.count += card.count;
                }
            });
            for (const a of archetypeRules) {
                const { name, rules } = a;
                let isMatch = true;
                rules.forEach((r) => {
                    if (isMatch) {
                        //short circuit if a rule isn't fit
                        let cardSet: Card[] = [];
                        switch (r.in) {
                            case "main":
                                cardSet = deck.main;
                                break;
                            case "side":
                                cardSet = deck.sideboard;
                                break;
                            case "both":
                                cardSet = combinedCards;
                                break;
                            default:
                                break;
                        }

                        isMatch = deckFitsRule(cardSet, r);
                    }
                });
                if (isMatch) {
                    if (a.prefixColors) {
                        const colorPresence = combinedCards.reduce(
                            (hasColor, card) => {
                                card.info?.colors.forEach((color) => {
                                    if (!card.info?.manaCost?.includes("/")) {
                                        hasColor[color] = true;
                                    }
                                });
                                return hasColor;
                            },
                            { W: false, U: false, B: false, R: false, G: false }
                        );
                        const colorString = `${colorPresence.U ? "U" : ""}${colorPresence.B ? "B" : ""}${colorPresence.R ? "R" : ""}${
                            colorPresence.G ? "G" : ""
                        }${colorPresence.W ? "W" : ""}`;
                        let colorPrefix = "";
                        const useGuildNames = false;
                        const useShardNames = true;
                        switch (colorString.length) {
                            case 1:
                                colorPrefix = `Mono-${colorString}`;
                                break;
                            case 2:
                                colorPrefix = useGuildNames ? guildMap[colorString] : colorString;
                                break;
                            case 3:
                                colorPrefix = useShardNames ? shardMap[colorString] : colorString;
                                break;
                            case 4:
                                colorPrefix = colorString;
                                break;
                            case 5:
                                colorPrefix = "5c";
                                break;
                        }
                        result.archetype = `${colorPrefix} ${name}`;
                    } else {
                        result.archetype = name;
                    }
                    break; //escape loop
                }
            }
            return result;
        },
        [archetypeRules]
    );

    const scrape = async () => {
        try {
            if (!wotcUrl) return;
            setIsLoading(true);
            const scrapedResults = await getDecksFromUrl(wotcUrl);
            const namedResults = scrapedResults.map((r) => identifyArchetype(r));
            generateCardCounts(namedResults);
            setResultList(namedResults);
            setHasScraped(true);
            setDeckModalOpen(true);
            setIsNumberedResults(wotcUrl.includes("champ") || wotcUrl.includes("challenge") || wotcUrl.includes("qualifier"));
            setIsLoading(false);
        } catch (error) {
            setScrapeError(true);
        }
    };

    // text generation
    const generatePlaintext = (results: Result[]) => {
        const resultLines = results.map(
            (r) => `${r.archetype ? `${r.archetype} | ` : ""}${r.pilot}: <${r.url}>${r.duplicatePilot ? " (duplicate pilot, link points to other list)" : ""}`
        );

        const [path] = wotcUrl.split("/").slice(-1);
        const title = path.slice(0, -10);
        const date = path.slice(-10);
        const titleLine = title.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) + date;
        return [titleLine, ...resultLines].join("\r\n");
    };

    const generateMarkdownLine = (result: Result): string => {
        const { deck, archetype, pilot, duplicatePilot, url } = result;

        const muUrl = `[${archetype || "archetype"}](${url})`;
        const muPilot = `**${pilot.replace(/[_]/g, "\\_")}${duplicatePilot ? " (duplicate pilot, link points to other list)" : ""}**`;

        const highlights = [...deck.main.filter((c) => c.highlighted), ...deck.sideboard.filter((c) => c.highlighted)].map((c) => c.name);
        const muHighlights = `(${Array.from(new Set(highlights.map((c) => `[[${c}]]`))).join(", ")})`;
        return `${isNumberedResults ? "1." : "*"} ${muUrl}: ${muPilot} ${highlights.length ? muHighlights : ""}`;
    };

    const generateMarkdown = (results: Result[]) => {
        if (!hasScraped) return "";
        const resultLines: string[] = [];
        for (const result of results) {
            const muString = generateMarkdownLine(result);
            resultLines.push(muString);
        }
        return [`Full Results: ${wotcUrl || ""}`, "", ...resultLines, "", thx].join("\r\n");
    };

    const copyToClipboard = async (text: string) => {
        if (!navigator.clipboard) {
            return;
        }
        await navigator.clipboard.writeText(text);
    };

    // filtering
    const deckHasCard = (deck: Deck, filterCards: string[]): boolean => {
        const cards = [...deck.main, ...deck.sideboard];
        if (cards.filter((c) => filterCards.includes(c.name)).length) {
            return true;
        }
        return false;
    };

    const deckHasExpansion = (deck: Deck, filterExpansions: string[]): boolean => {
        const cards = [...deck.main, ...deck.sideboard];
        const nonBasics = cards.filter(
            (c) =>
                ![
                    "Plains",
                    "Island",
                    "Swamp",
                    "Mountain",
                    "Forest",
                    "Snow-Covered Plains",
                    "Snow-Covered Island",
                    "Snow-Covered Swamp",
                    "Snow-Covered Mountain",
                    "Snow-Covered Forest"
                ].includes(c.name)
        );
        const expansions = nonBasics.flatMap((c) => c.info?.printings || []);
        const deduped = [...new Set(expansions)];

        if (deduped.filter((e) => filterExpansions.includes(e)).length) {
            return true;
        }
        return false;
    };

    const applyDeckFilters = useCallback(
        (results: Result[]): Result[] => {
            const spicyResults = results.filter((r) => !filterForSpice || r.spicy);
            const faveResults = spicyResults.filter((r) => !filterForFave || r.favorite);
            const expacResults = faveResults.filter((r) => !selectedExpansions.length || deckHasExpansion(r.deck, selectedExpansions));
            const cardResults = expacResults.filter((r) => !selectedCards.length || deckHasCard(r.deck, selectedCards));
            return cardResults;
        },
        [selectedCards, selectedExpansions, filterForFave, filterForSpice]
    );

    const applyCardFilters = useCallback(
        (cards: CardCount[]): CardCount[] => {
            const filteredBySet = cards.filter(
                (c) => !selectedExpansions.length || c.card.info?.printings.filter((p) => selectedExpansions.includes(p)).length
            );
            const filteredByCard = filteredBySet.filter((c) => !selectedCards.length || selectedCards.includes(c.card.name));
            return filteredByCard;
        },
        [selectedCards, selectedExpansions]
    );

    const filteredResults = applyDeckFilters(resultList);
    const filteredCardCounts = applyCardFilters(cardCounts);

    const previewText = textFormat === "markdown" ? generateMarkdown(filteredResults) : generatePlaintext(filteredResults);

    const decksByCard: string = cardCounts
        .filter(
            (c) =>
                ![
                    "Plains",
                    "Island",
                    "Swamp",
                    "Mountain",
                    "Forest",
                    "Snow-Covered Plains",
                    "Snow-Covered Island",
                    "Snow-Covered Swamp",
                    "Snow-Covered Mountain",
                    "Snow-Covered Forest"
                ].includes(c.card.name)
        )
        .filter((c) => c.card.info?.printings.includes(setList[0].code) && (showReprints || c.card.info?.printings.length === 1))
        .map((c) => {
            const cardName = `* [[${c.card.name}]]`;
            const urls = resultList
                .filter((r) => deckHasCard(r.deck, [c.card.name]))
                .map((r) => {
                    return `**[${r.archetype || "archetype"}](${r.url})**`;
                });
            return `${cardName} ${[...urls].join(", ")}`;
        })
        .join("\r\n");

    const panes = [
        {
            menuItem: "Preview",
            pane: (
                <Tab.Pane key="Preview">
                    <Form>
                        <Form.TextArea value={previewText} style={{ height: 500 }} />
                    </Form>
                </Tab.Pane>
            )
        },
        {
            menuItem: "Card Counts",
            pane: (
                <Tab.Pane key="Counts">
                    <Form>
                        <Form.TextArea
                            value={filteredCardCounts
                                .sort((a, b) => b.card.count - a.card.count)
                                .map(
                                    (c) =>
                                        `${c.card.count} cop${c.card.count > 1 ? "ies" : "y"} of ${c.card.name} in ${c.deckCount} deck${
                                            c.deckCount > 1 ? "s" : ""
                                        }`
                                )
                                .join("\r\n")}
                            style={{ height: 500 }}
                        />
                    </Form>
                </Tab.Pane>
            )
        },
        {
            menuItem: `Decks with ${setList[0].code} Cards`,
            pane: (
                <Tab.Pane key="ByCard">
                    <Form>
                        <Form.Checkbox label="Show Reprints?" checked={!!showReprints} onChange={(e, { checked }) => setShowReprints(!!checked)} />
                        <Form.TextArea style={{ height: 500 }} value={decksByCard} />
                    </Form>
                </Tab.Pane>
            )
        }
    ];

    const handleRulesModalClose = (refresh: boolean) => {
        if (refresh) {
            const namedResults = resultList.map((r) => identifyArchetype(r));
            setResultList(namedResults);
        }
        setRulesModalOpen(false);
    };

    return (
        <Container className="App">
            {isLoading && (
                <Dimmer active inverted>
                    <Loader size="large">Loading</Loader>
                </Dimmer>
            )}
            <Header>MTGO Results Scraper</Header>
            <Grid columns={16}>
                <Grid.Row>
                    <Message success>
                        The scraper should be functional, but there will likely be some bugs as the new MTGO team works out issues with their site and I try to
                        keep up. Please <a href="https://reddit.com/message/compose/?to=FereMiyJeenyus">message me on Reddit</a> if you notice anything, and I
                        will fix it as soon as possible.
                        <br />
                        KNOWN ISSUE: Challenges are shown ordered entirely by Swiss standings, instead of by top 8 results and Swiss for players 9-32.
                    </Message>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} textAlign="left">
                        <Input value={wotcUrl} onChange={(e) => setWotcUrl(e.target.value)} placeholder="Deck Dump URL" />
                        <a href="https://www.mtgo.com/en/mtgo/decklists" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "1em" }}>
                            MTGO Results
                        </a>
                    </Grid.Column>
                    <Grid.Column width={13} textAlign="left">
                        <List horizontal>
                            <List.Item>
                                <Button onClick={scrape} content="Scrape" />
                            </List.Item>
                            <List.Item>
                                <Button onClick={() => setDeckModalOpen(true)} content="Decks" disabled={!hasScraped} />
                            </List.Item>
                            <List.Item>
                                <Button
                                    onClick={() => {
                                        setRulesModalOpen(true);
                                    }}
                                    content="Archetype Definitions"
                                />
                            </List.Item>
                            <List.Item>
                                <Button onClick={() => setInfoModalOpen(true)} content="What is this?" />
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>
                        <Accordion>
                            <Accordion.Title
                                active={expandOptions}
                                onClick={() => {
                                    setExpandOptions(!expandOptions);
                                }}
                            >
                                <Icon name="dropdown" />
                                <span>Filters and Options (mostly functional, will make it look nicer soon)</span>
                                <div className="accordion-title-line" />
                            </Accordion.Title>
                            <Accordion.Content active={expandOptions}>
                                <Form.Dropdown
                                    label="Filter By Card: "
                                    multiple
                                    clearable
                                    search
                                    selection
                                    lazyLoad
                                    value={selectedCards}
                                    options={cardOptions || []}
                                    onChange={(_e, { value }) => {
                                        setSelectedCards(value as string[]);
                                    }}
                                />
                                <Form.Dropdown
                                    label="Filter By Expansion: "
                                    multiple
                                    clearable
                                    search
                                    selection
                                    value={selectedExpansions}
                                    options={setList.map((s) => ({
                                        key: s.code,
                                        value: s.code,
                                        text: s.name
                                    }))}
                                    onChange={(_e, { value }) => {
                                        setSelectedExpansions(value as string[]);
                                    }}
                                />
                                <Form.Field>Preview Text</Form.Field>
                                <Form.Checkbox
                                    radio
                                    name="textFormatRadioGroup"
                                    label="Markdown"
                                    value={textFormat}
                                    checked={textFormat === "markdown"}
                                    onClick={() => setTextFormat("markdown")}
                                />
                                <Form.Checkbox
                                    radio
                                    name="textFormatRadioGroup"
                                    label="Plaintext"
                                    value={textFormat}
                                    checked={textFormat === "plaintext"}
                                    onClick={() => setTextFormat("plaintext")}
                                />
                                <Form.Checkbox
                                    toggle
                                    label="Marked as Spicy?"
                                    checked={filterForSpice}
                                    onChange={(_e, { checked }) => setFilterForSpice(!!checked)}
                                />
                                <Form.Checkbox
                                    toggle
                                    label="Marked as Favorite?"
                                    checked={filterForFave}
                                    onChange={(_e, { checked }) => setFilterForFave(!!checked)}
                                />
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>
                        {scrapeError && (
                            <Message negative>
                                <p>There was an error while attempting to scrape results. Please try again later</p>
                            </Message>
                        )}
                        <Tab panes={panes} renderActiveOnly={false} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Button
                        onClick={() => {
                            copyToClipboard(generatePlaintext(filteredResults));
                        }}
                        content="Copy Plaintext"
                    />
                    <Button
                        onClick={() => {
                            copyToClipboard(generateMarkdown(filteredResults));
                        }}
                        content="Copy Markdown"
                    />
                </Grid.Row>
            </Grid>
            <DeckDetailModal
                open={deckModalOpen && !!resultList?.length}
                onClose={() => setDeckModalOpen(false)}
                results={resultList}
                setResults={setResultList}
            />
            <RulesModal open={rulesModalOpen} onClose={handleRulesModalClose} archetypeRules={archetypeRules} setArchetypeRules={setArchetypeRules} />
            <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
        </Container>
    );
};

export default App;
