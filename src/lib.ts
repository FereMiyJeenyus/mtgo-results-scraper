import fetch from "node-fetch";
import { Archetype, Card, CardCount, Deck, guildMap, Result, ScrapeResult, shardMap } from "./types";
import cardInfo from "./resources/cardInfo.json";

export const identifyArchetype = (result: Result, archetypeRules: Archetype[]): Result => {
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
            const { atLeast, atMost, cardName } = r;
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

                isMatch =
                    (atMost === 0 && !cardSet.some((c) => c.name === cardName)) ||
                    cardSet.some((c) => c.name === cardName && (!atLeast || c.count >= atLeast) && (!atMost || c.count <= atMost));
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
                const colorString = `${colorPresence.U ? "U" : ""}${colorPresence.B ? "B" : ""}${colorPresence.R ? "R" : ""}${colorPresence.G ? "G" : ""}${
                    colorPresence.W ? "W" : ""
                }`;
                let colorPrefix = "";
                const useGuildNames = false;
                const useShardNames = true;
                switch (colorString.length) {
                    case 0:
                        colorPrefix = `Colorless`;
                        break;
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
};

export const generateCardCounts = (results: Result[]): CardCount[] => {
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

    return counts;
};

export const scrapeUrl = async (url: string): Promise<ScrapeResult | undefined> => {
    try {
        const response = await fetch(`https://scraper-cors.herokuapp.com/${url}`);
        const body = await response.text();
        const decklistLineRegex = new RegExp("window.MTGO.decklists.data = .*;");
        const aetherRegex = new RegExp("Ã[^ ]*r");
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
                    if (aetherRegex.test(c.CARD_ATTRIBUTES.NAME)) c.CARD_ATTRIBUTES.NAME = c.CARD_ATTRIBUTES.NAME.replace(aetherRegex, "Aether");
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
                    url: `${url}#deck_${d.player}`,
                    archetype: "",
                    id: i,
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
            return {
                id: 0,
                mtgoUrl: url,
                eventType: parsed.event_name,
                eventDate: parsed.date.split("T")[0],
                deckResults: results,
                cardCounts: generateCardCounts(results),
                numbered: url.includes("champ") || url.includes("challenge") || url.includes("qualifier")
            };
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
    return;
};
