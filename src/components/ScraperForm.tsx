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
        setIsLoading(true);
        for (let index = 0; index < splitUrls.length; index++) {
            const url = splitUrls[index];
            try {
                if (!url?.startsWith("https://www.mtgo.com")) throw new Error(`non mtgo url ${url}`);
                const scrape = await scrapeUrl(url);
                if (!scrape) throw new Error(`no scraped results returned for ${url}`);

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
