import fetch from "node-fetch";
import { Card, Deck, Result } from "./types";
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
                const results: Result[] = [];
                parsed.decks.map((d, i) => {
                    const parsedMain = d.deck.find((x) => !x.SB).DECK_CARDS;
                    const parsedSideboard = d.deck.find((x) => x.SB).DECK_CARDS;
                    const main: Card[] = [];
                    parsedMain.forEach((c) => {
                        const existingCard = main.find((c2) => c2.name === c.CARD_ATTRIBUTES.NAME);
                        if (existingCard) {
                            existingCard.count += c.Quantity;
                        } else {
                            main.push({
                                name: c.CARD_ATTRIBUTES.NAME,
                                count: c.Quantity,
                                highlighted: false,
                                info: cardInfo[c.CARD_ATTRIBUTES.NAME]
                            });
                        }
                    });
                    const sideboard: Card[] = [];
                    parsedSideboard.forEach((c) => {
                        const existingCard = sideboard.find((c2) => c2.name === c.CARD_ATTRIBUTES.NAME);
                        if (existingCard) {
                            existingCard.count += c.Quantity;
                        } else {
                            sideboard.push({
                                name: c.CARD_ATTRIBUTES.NAME,
                                count: c.Quantity,
                                highlighted: false,
                                info: cardInfo[c.CARD_ATTRIBUTES.NAME]
                            });
                        }
                    });
                    const deck: Deck = {
                        main,
                        sideboard
                    };
                    results.push({
                        pilot: d.player,
                        url: `${wotcUrl}#deck_${d.player}`,
                        archetype: "",
                        index: i,
                        favorite: false,
                        spicy: false,
                        deck,
                        duplicatePilot: !!results.find((r) => r.pilot === d.player)
                    });
                });
                if (parsed.STANDINGS) {
                    results.sort((a, b) => {
                        const aStanding = parsed.STANDINGS.find((s) => s.NAME === a.pilot);
                        const bStanding = parsed.STANDINGS.find((s) => s.NAME === b.pilot);
                        return aStanding.RANK - bStanding.RANK;
                    });
                }
                return results;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    return [];
};
