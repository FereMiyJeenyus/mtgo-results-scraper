import React, { useState, useCallback } from "react";
import "semantic-ui-css/semantic.min.css";
import { Header, Container, Grid, Input, Button, Form, Message, Tab, List, DropdownItemProps, Accordion, Icon } from "semantic-ui-react";
import "./App.css";
import { getDecksFromUrl } from "./scraper";
import { Result, Deck, setList, CardCount } from "./types";
import DeckDetailModal from "./DeckDetailModal";
import InfoModal from "./InfoModal";

export type TextFormat = "plaintext" | "markdown";
const thx = `Direct links courtesy of /u/FereMiyJeenyus and their [MTGO Results Scraper](https://feremiyjeenyus.github.io/mtgo-results-scraper/)`;

const App: React.FC = () => {
    const [hasScraped, setHasScraped] = useState<boolean>(false);
    const [wotcUrl, setWotcUrl] = useState<string>("");
    const [resultList, setResultList] = useState<Result[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [cardOptions, setCardOptions] = useState<DropdownItemProps[]>();
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

    // scraping
    const generateCardCounts = (results: Result[]) => {
        const counts: CardCount[] = [];
        results.forEach((r) => {
            r.deck.maindeck.forEach((card) => {
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
                        card: {
                            name: card.name,
                            count: card.count,
                            highlighted: false
                        },
                        deckCount: 1
                    });
                } else {
                    countRow.card.count += card.count;
                    if (!r.deck.maindeck.find((c) => c.name === card.name)) {
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

    const scrape = async () => {
        try {
            if (!wotcUrl) return;
            const scrapedResults = await getDecksFromUrl(wotcUrl);
            generateCardCounts(scrapedResults);
            setResultList(scrapedResults);
            setHasScraped(true);
            setDeckModalOpen(true);
            setIsNumberedResults(wotcUrl.includes("champ") || wotcUrl.includes("challenge"));

            if (scrapedResults.length) {
                setDeckModalOpen(true);
            }
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

        const highlights = [...deck.maindeck.filter((c) => c.highlighted), ...deck.sideboard.filter((c) => c.highlighted)].map((c) => c.name);
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
        const cards = [...deck.maindeck, ...deck.sideboard];
        if (cards.filter((c) => filterCards.includes(c.name)).length) {
            return true;
        }
        return false;
    };

    const deckHasExpansion = (deck: Deck, filterExpansions: string[]): boolean => {
        const cards = [...deck.maindeck, ...deck.sideboard];
        const nonBasics = cards.filter((c) => !["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(c.name));
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

    const decksByCard: string = filteredCardCounts
        .filter((c) => !["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(c.card.name))
        .map((c) => {
            const cardName = `* [[${c.card.name}]]`;
            const urls = resultList
                .filter((r) => deckHasCard(r.deck, [c.card.name]))
                .map((r) => {
                    return `[${r.archetype || "archetype"}](${r.url})`;
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
            menuItem: "Decks by Card",
            pane: (
                <Tab.Pane key="ByCard">
                    <Form>
                        <Form.TextArea style={{ height: 500 }} value={decksByCard} />
                    </Form>
                </Tab.Pane>
            )
        }
    ];

    return (
        <Container className="App">
            <Header>MTGO Results Scraper</Header>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column width={3} textAlign="left">
                        <Input value={wotcUrl} onChange={(e) => setWotcUrl(e.target.value)} placeholder="Deck Dump URL" />
                        <a
                            href="https://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "1em" }}
                        >
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
                                <Button onClick={() => setInfoModalOpen(true)} content="What's this?" />
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
            <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
        </Container>
    );
};

export default App;
