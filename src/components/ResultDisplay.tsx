import React, { useState } from "react";
import { Button, Container, List, Message } from "semantic-ui-react";
import DeckList from "../DeckList";
import { Result, ScrapeResult, thx } from "../types";
import { updateScrapeResult } from "../scrapeResultSlice";
import { useDispatch } from "react-redux";

interface ResultDisplayProps {
    scrapeResult: ScrapeResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = (props: ResultDisplayProps) => {
    const { scrapeResult } = props;
    const { eventType, eventDate, deckResults } = scrapeResult;
    const dispatch = useDispatch();

    const [copyMessageVisible, setCopyMessageVisible] = useState<boolean>(false);

    const copyToClipboard = async (text: string) => {
        if (!navigator.clipboard) {
            return;
        }
        await navigator.clipboard.writeText(text);
    };

    const generateMarkdown = () => {
        const resultLines: string[] = [];
        for (const result of deckResults) {
            const { deck, archetype, pilot, duplicatePilot, url } = result;

            const muUrl = `[${archetype || "archetype"}](${url})`;
            const muPilot = `**${pilot.replace(/[_]/g, "\\_")}${duplicatePilot ? " (duplicate pilot, link points to other list)" : ""}**`;

            const highlights = [...deck.main.filter((c) => c.highlighted), ...deck.sideboard.filter((c) => c.highlighted)].map((c) => c.name);
            const muHighlights = `(${Array.from(new Set(highlights.map((c) => `[[${c}]]`))).join(", ")})`;
            const muString = `${scrapeResult.numbered ? "1." : "*"} ${muUrl}: ${muPilot} ${highlights.length ? muHighlights : ""}`;
            resultLines.push(muString);
        }
        return [`Full Results: ${scrapeResult.mtgoUrl || ""}`, "", ...resultLines, "", thx].join("\r\n");
    };

    const handleMarkdownClick = async () => {
        const text = generateMarkdown();
        await copyToClipboard(text);
        setCopyMessageVisible(true);
        setTimeout(() => {
            setCopyMessageVisible(false);
        }, 3000);
    };

    const updateDeck = (deckResult: Result) => {
        const res = [...scrapeResult.deckResults];
        const index = res.findIndex((r) => r.id === deckResult.id);
        res[index] = deckResult;
        dispatch(updateScrapeResult({ ...scrapeResult, deckResults: res }));
    };

    return (
        <Container>
            <List>
                <List.Item>
                    <List.Content floated="right">
                        <Button content="Copy Markdown" onClick={handleMarkdownClick} />
                    </List.Content>
                    <List.Content floated="right">
                        <Message success floating content="Copied to clipboard!" hidden={!copyMessageVisible} onDismiss={() => setCopyMessageVisible(false)} />
                    </List.Content>
                    <List.Content>
                        {eventType} {eventDate}
                    </List.Content>
                </List.Item>
            </List>
            {deckResults.map((d, i) => (
                <DeckList key={i} result={d} updateDeck={updateDeck} />
            ))}
        </Container>
    );
};

export default ResultDisplay;
