import React, { useState, useEffect } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Header, Container, Grid, Input, Button, Form, Modal, Message, Progress, Tab, List, ListItem } from 'semantic-ui-react'
import './App.css';
import { getDecksFromUrl } from './scraper'
import { Result, Card } from './types'
import DeckList from './DeckList'

const thx = `Direct links courtesy of /u/FereMiyJeenyus and their [MTGO Results Scraper](https://feremiyjeenyus.github.io/mtgo-results-scraper/)`;

const App: React.FC = () => {
  const [hasScraped, setHasScraped] = useState<boolean>(false)
  const [wotcUrl, setWotcUrl] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [resultsMarkup, setResultsMarkup] = useState<string[]>([]);
  const [cardCounts, setCardCounts] = useState<string[]>([]);
  const [displayedDeck, setDisplayedDeck] = useState<Result>();
  const [displayedDeckIndex, setDisplayedDeckIndex] = useState<number>();
  const [deckModalOpen, setDeckModalOpen] = useState<boolean>(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<boolean>(false);
  const [isNumberedResults, setIsNumberedResults] = useState<boolean>(false);

  useEffect(() => {
    if (results && !hasScraped) {
      setDisplayedDeck(results[0])
      setDisplayedDeckIndex(0)
    }
  }, [results, hasScraped]);

  useEffect(() => {
    if (wotcUrl && (wotcUrl.includes("champ") || wotcUrl.includes("challenge"))) {
      setIsNumberedResults(true)
    }
  }, [wotcUrl]);



  const generateMarkupLine = (result: Result): string => {
    const { deck, archetype, pilot, duplicatePilot, url } = result

    const muUrl = `[${archetype || 'archetype'}](${url})`
    const muPilot = `**${pilot.replace(/[_]/g, "\\_")}${duplicatePilot ? " (duplicate pilot, link points to other list)" : ""}**`

    const highlights = [...deck.maindeck.filter(c => c.highlighted), ...deck.sideboard.filter(c => c.highlighted)].map(c => c.name)
    const muHighlights = `(${Array.from(new Set(highlights.map(c => `[[${c}]]`))).join(", ")})`
    return `${isNumberedResults ? '1.' : '*'} ${muUrl}: ${muPilot} ${highlights.length ? muHighlights : ""}`
  }

  const generateMarkup = (results: Result[]) => {
    const mu: string[] = [];
    for (const result of results) {
      const muString = generateMarkupLine(result)
      mu.push(muString)
    }
    setResultsMarkup(mu);
  }

  const generateCardCounts = (results: Result[]) => {
    const counts: { card: Card, deckCount: number }[] = []
    results.forEach(r => {
      r.deck.maindeck.forEach(card => {
        const countRow = counts.find(c => c.card.name === card.name);
        if (!countRow) {
          counts.push({
            card: { name: card.name, count: card.count, highlighted: false },
            deckCount: 1
          })
        }
        else {
          countRow.card.count += card.count;
          countRow.deckCount++;
        }
      })

      r.deck.sideboard.forEach(card => {
        const countRow = counts.find(c => c.card.name === card.name);
        if (!countRow) {
          counts.push({
            card: { name: card.name, count: card.count, highlighted: false },
            deckCount: 1
          })
        }
        else {
          countRow.card.count += card.count;
          if (!r.deck.maindeck.find(c => c.name === card.name)) {
            countRow.deckCount++;
          }
        }
      })
    })

    counts.sort((a, b) => b.card.count - a.card.count)
    setCardCounts(counts.map(c => `${c.card.count} cop${c.card.count > 1 ? 'ies' : 'y'} of ${c.card.name} in ${c.deckCount} deck${c.deckCount > 1 ? 's' : ''}`))
  }


  const scrape = async () => {
    try {
      if (!wotcUrl) return;
      const scrapedResults = await getDecksFromUrl(wotcUrl);
      generateMarkup(scrapedResults);
      generateCardCounts(scrapedResults);
      setResults(scrapedResults);
      setHasScraped(true);
    } catch (error) {
      setScrapeError(true)
    }
  }

  const goToNextDeck = () => {
    if (!displayedDeck) {
      return
    }
    const index = displayedDeckIndex!

    const res = [...results]
    res[index] = displayedDeck;
    setResults(res);

    const mu = resultsMarkup
    mu[index] = generateMarkupLine(displayedDeck)
    setResultsMarkup(mu)
    if (index + 1 < results.length) {
      setDisplayedDeck(results[index + 1])
      setDisplayedDeckIndex(index + 1);
    }
    else {
      setDeckModalOpen(false);
    }
  }

  const goToPreviousDeck = () => {
    if (!displayedDeck) {
      return
    }
    const index = displayedDeckIndex!

    const res = [...results]
    res[index] = displayedDeck;
    setResults(res);

    const mu = [...resultsMarkup]
    mu[index] = generateMarkupLine(displayedDeck)
    setResultsMarkup(mu)

    if (index !== 0) {
      setDisplayedDeck(results[index - 1])
      setDisplayedDeckIndex(index - 1);
    }
    else {
      setDeckModalOpen(false);
    }
  }

  const panes = [
    {
      menuItem: 'Markdown', pane:
        <Tab.Pane key='Markdown'>
          <Form>
            <Form.TextArea value={
              [
                `Full Results: ${wotcUrl || ""}`,
                "",
                ...resultsMarkup,
                "",
                thx
              ].join("\r\n")
            } style={{ height: 500 }} />
          </Form>
        </Tab.Pane>
    },
    {
      menuItem: 'Card Counts', pane:
        <Tab.Pane key='Counts'>
          <Form>
            <Form.TextArea value={cardCounts?.join("\r\n")} style={{ height: 500 }} />
          </Form>
        </Tab.Pane>
    }
  ]

  return (
    <Container className="App">
      <Header>MTGO Results Scraper</Header>
      <Grid columns={16}>
        <Grid.Row>
          <Grid.Column width={3} textAlign="left">
            <Input value={wotcUrl} onChange={(e) => setWotcUrl(e.target.value)} placeholder="Deck Dump URL" />
            <a
              href='https://magic.wizards.com/en/content/deck-lists-magic-online-products-game-info'
              target='_blank'
              rel="noopener noreferrer"
              style={{ marginLeft: '1em' }}>
              MTGO Results
            </a>
          </Grid.Column>
          <Grid.Column width={13} textAlign="left">
            <List horizontal>
              <List.Item><Button onClick={scrape} content="Scrape" /></List.Item>
              <List.Item><Button onClick={() => (setDeckModalOpen(true))} content="Decks" disabled={!hasScraped} /></List.Item>
              <List.Item><Button onClick={() => (setTutorialModalOpen(true))} content="What's this?" /></List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            {scrapeError &&
              <Message negative>
                <p>There was an error while attempting to scrape results. Please try again later</p>
              </Message>
            }
            <Tab panes={panes} renderActiveOnly={false} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal
        open={deckModalOpen && !!displayedDeck}
        centered={false}
        onClose={() => setDeckModalOpen(false)}
        closeOnDimmerClick={false}
        closeIcon>
        <Modal.Content>
          {displayedDeck &&
            <DeckList result={displayedDeck} goToNextDeck={goToNextDeck} goToPreviousDeck={goToPreviousDeck} setDisplayedDeck={setDisplayedDeck} />
          }
          <Progress
            value={displayedDeckIndex ? displayedDeckIndex + 1 : ""}
            total={results ? results.length : 0}
            progress='ratio'
            style={{ marginTop: '1em', marginBottom: 0 }}
          />
        </Modal.Content>
      </Modal>
      <Modal
        open={tutorialModalOpen}
        centered={false}
        onClose={() => setTutorialModalOpen(false)}
        closeOnDimmerClick={true}
        closeIcon>
        <Modal.Content>
          <List>
            <List.Item>
              <List.Header>What am I looking at?</List.Header>
              <Container style={{ padding: "0.5em 1.25em 0.25em" }}>This is a web tool for scraping Wizards of the Coast's MTGO results posts and formatting the contents for a Reddit post (or  else that supports Markdown)</Container>
            </List.Item>
            <List.Item>
              <List.Header>How do I use it?</List.Header>
              <Container style={{ paddingLeft: "1em" }}>
                <List ordered>
                  <ListItem>Paste the url for a WotC deck dump in the little box and click 'Scrape.'</ListItem>
                  <ListItem>Click 'Decks' to view the decklists. From there, you can name them and click cards to highlight them.</ListItem>
                  <ListItem>Copy the resulting text into your Reddit post. Be sure you're in 'Markdown Mode' or your links will get ugly.</ListItem>
                </List>
              </Container>
            </List.Item>
            <List.Item>
              <List.Header>How can I report a bug or suggest a feature?</List.Header>
              <Container style={{ padding: "0.5em 1.25em " }}>Message me on Reddit: <a href="https://reddit.com/message/compose/?to=FereMiyJeenyus">/u/FereMiyJeenyus</a></Container>
            </List.Item>
          </List>
        </Modal.Content>
      </Modal>
    </Container>
  );
}

export default App;
