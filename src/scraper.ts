import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Deck, Result } from "./types";
import cardInfo from "./resources/cardInfo.json";

const regex = /[^A-Za-z _-]/g;
const spaces = / /g;

export const getDecksFromUrl = async (wotcUrl: string): Promise<Result[]> => {
    const results: Result[] = [];
    if (wotcUrl.startsWith("https://mtgo.com")) {
        try {
            const response = await fetch(`https://scraper-cors.herokuapp.com/${wotcUrl}`);
            const body = await response.text();
            const $ = cheerio.load(body);
            const usernames: string[] = [];
            $(".deck-group").each((index: number, dg: cheerio.Element) => {
                const headerContent = $(dg).find("h4").text();
                const username = headerContent.split(" (")[0];
                const duplicatePilot = usernames.includes(username);
                usernames.push(username);
                const parts = headerContent.split(" (");
                const name = parts[0];
                let chaff = "";
                if (parts[1]) {
                    chaff = parts[1].replace(regex, "").replace(spaces, "_").toLowerCase();
                }
                const url = `${wotcUrl}#${name.replace(regex, "").replace(spaces, "_").toLowerCase()}${chaff ? "_" + chaff : ""}`;

                const deck: Deck = {
                    main: [],
                    sideboard: []
                };
                $(dg)
                    .find(".sorted-by-overview-container")
                    .find(".row")
                    .each((index: number, row: cheerio.Element) => {
                        const name: string = $(row).find(".card-name").text().trim();
                        const info = cardInfo[name] || cardInfo[name.split("//")[0].trim()];
                        deck.main.push({
                            name,
                            count: parseInt($(row).find(".card-count").text(), 10),
                            highlighted: false,
                            info
                        });
                    });

                $(dg)
                    .find(".sorted-by-sideboard-container")
                    .find(".row")
                    .each((index: number, row: cheerio.Element) => {
                        const name = $(row).find(".card-name").text().trim();
                        const info = cardInfo[name] || cardInfo[name.split("//")[0].trim()];
                        deck.sideboard.push({
                            name,
                            count: parseInt($(row).find(".card-count").text(), 10),
                            highlighted: false,
                            info
                        });
                    });

                results.push({
                    pilot: username,
                    url: url,
                    deck: deck,
                    duplicatePilot,
                    archetype: "",
                    favorite: false,
                    spicy: false,
                    index
                });
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    return results;
};
