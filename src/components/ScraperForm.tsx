import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Dimmer, Form, Grid, Header, List, Loader, Message, TextArea } from "semantic-ui-react";
import { identifyArchetype, scrapeUrl } from "../lib";
import { Archetype } from "../types";
import ResultDisplay from "./ResultDisplay";
import { clearResults, pushScrapeResult, selectScrapeResults } from "../scrapeResultSlice";
import { useDispatch, useSelector } from "react-redux";

const ScraperForm: React.FC = () => {
    const [urls, setUrls] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const scrapeResults = useSelector(selectScrapeResults);
    const dispatch = useDispatch();

    const scrapeUrls = async () => {
        dispatch(clearResults());
        const splitUrls = urls.split(";").map((s) => s.trim());
        for (let index = 0; index < splitUrls.length; index++) {
            const url = splitUrls[index];
            try {
                if (!url?.startsWith("https://www.mtgo.com")) return;
                setIsLoading(true);
                const scrape = await scrapeUrl(url);
                if (!scrape) return;

                const rulesFromStorage = window.localStorage?.getItem("archetypeRules");
                let archetypeRules: Archetype[] = [];
                if (rulesFromStorage && rulesFromStorage !== "undefined") {
                    archetypeRules = JSON.parse(rulesFromStorage);
                }
                const namedResults = scrape?.deckResults.map((r) => identifyArchetype(r, archetypeRules));

                dispatch(pushScrapeResult({ ...scrape, deckResults: namedResults, id: index }));
            } catch (error) {
                console.error(error);
            }
        }
        setIsLoading(false);
    };

    return (
        <>
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
                    <Grid.Column width={8} textAlign="left">
                        <Form>
                            <TextArea value={urls} onInput={(e, data) => setUrls(data.value as string)} placeholder="Deck Dump URLs, separated by semicolons" />
                        </Form>
                        <a href="https://www.mtgo.com/en/mtgo/decklists" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "1em" }}>
                            MTGO Results
                        </a>
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="left">
                        <List horizontal>
                            <List.Item>
                                <Button onClick={scrapeUrls} content="Scrape" />
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>
                {!!scrapeResults.length &&
                    scrapeResults.map((r, i) => (
                        <Grid.Row key={i}>
                            <ResultDisplay scrapeResult={r} />
                        </Grid.Row>
                    ))}
            </Grid>
        </>
    );
};

export default ScraperForm;
