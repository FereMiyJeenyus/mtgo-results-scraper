import fetch from "node-fetch";
import { Deck, Result } from "./types";
import cardInfo from "./resources/cardInfo.json";

export const getDecksFromUrl = async (wotcUrl: string): Promise<Result[]> => {
    if (wotcUrl.startsWith("https://www.mtgo.com")) {
        try {
            const response = await fetch(`https://scraper-cors.herokuapp.com/${wotcUrl}`);
            const body = await response.text();
            const decklistLineRegex = new RegExp("window.MTGO.decklists.data = .*;");
            const match = decklistLineRegex.exec(body);
            if (match) {
                const parsed = JSON.parse(match[0].split(" = ")[1].split(";")[0]);
                console.log(parsed);
                return parsed.decks.map((d, i) => {
                    const parsedDeck = d.deck.find((x) => !x.SB).DECK_CARDS;
                    const parsedSideboard = d.deck.find((x) => x.SB).DECK_CARDS;
                    const deck: Deck = {
                        main: parsedDeck.map((c) => ({
                            name: c.CARD_ATTRIBUTES.NAME,
                            count: c.Quantity,
                            highlighted: false,
                            info: cardInfo[c.CARD_ATTRIBUTES.NAME]
                        })),
                        sideboard: parsedSideboard.map((c) => ({
                            name: c.CARD_ATTRIBUTES.NAME,
                            count: c.Quantity,
                            highlighted: false,
                            info: cardInfo[c.CARD_ATTRIBUTES.NAME]
                        }))
                    };
                    return {
                        pilot: d.player,
                        url: `${wotcUrl}#deck_${d.player}`,
                        archetype: "",
                        index: i,
                        favorite: false,
                        spicy: false,
                        deck,
                        duplicatePilot: false
                    };
                });
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    return [];
};
