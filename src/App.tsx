import React, { useState, useEffect } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Header, Container, Grid, Input, Button, Form, Modal, Message, Progress, Tab } from 'semantic-ui-react'
import './App.css';
import { getDecksFromUrl } from './scraper'
import { Result, Card } from './types'
import DeckList from './DeckList'

const App: React.FC = () => {
  const [hasScraped, setHasScraped] = useState<boolean>(false)
  const [wotcUrl, setWotcUrl] = useState<string>("");
  const [results, setResults] = useState<Result[]>([]);
  const [markup, setMarkup] = useState<string[]>([]);
  const [cardCounts, setCardCounts] = useState<string[]>([]);
  const [displayedDeck, setDisplayedDeck] = useState<Result>();
  const [displayedDeckIndex, setDisplayedDeckIndex] = useState<number>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<boolean>(false);

  useEffect(() => {
    if (results && !hasScraped) {
      setDisplayedDeck(results[0])
      setDisplayedDeckIndex(0)
    }
  }, [results, hasScraped]);

  const generateMarkupLine = (result: Result): string => {
    const { deck, archetype, pilot, duplicatePilot, url } = result

    const muUrl = `[${archetype || 'archetype'}](${url})`
    const muPilot = `**${pilot.replace(/[_]/g, "\\_")}${
      duplicatePilot ? " (duplicate pilot, link points to other list)" : ""}**`

    const highlights = [...deck.maindeck.filter(c => c.highlighted), ...deck.sideboard.filter(c => c.highlighted)].map(c => c.name)
    const muHighlights = `(${Array.from(new Set(highlights)).join(", ")})`
    return `* ${muUrl}: ${muPilot} ${highlights.length ? muHighlights : ""}`
  }

  const generateMarkup = (results: Result[]) => {
    const mu: string[] = [];
    for (const result of results) {
      const muString = generateMarkupLine(result)
      mu.push(muString)
    }
    setMarkup(mu);
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

    const mu = markup
    mu[index] = generateMarkupLine(displayedDeck)
    setMarkup(mu)
    if (index + 1 < results.length) {
      setDisplayedDeck(results[index + 1])
      setDisplayedDeckIndex(index + 1);
    }
    else {
      setModalOpen(false);
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

    const mu = [...markup]
    mu[index] = generateMarkupLine(displayedDeck)
    setMarkup(mu)

    if (index !== 0) {
      setDisplayedDeck(results[index - 1])
      setDisplayedDeckIndex(index - 1);
    }
    else {
      setModalOpen(false);
    }
  }

  const panes = [
    {
      menuItem: 'Markdown', pane:
        <Tab.Pane key='Markdown'>
          <Form>
            <Form.TextArea value={markup?.join("\r\n")} style={{ height: 500 }} />
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
          <Grid.Column width={2} textAlign="left">
            <Button onClick={scrape} content="Scrape" />
          </Grid.Column>
          <Grid.Column width={2} textAlign="left">
            <Button onClick={() => (setModalOpen(true))} content="Walkthrough" />
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
        open={modalOpen && !!displayedDeck}
        centered={false}
        onClose={() => setModalOpen(false)}
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
    </Container>
  );
}

export default App;
