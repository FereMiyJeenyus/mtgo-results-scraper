import rp from "request-promise";
import * as cheerio from "cheerio";
import { Deck, Result } from './types';
import cardInfo from './resources/cardInfo.json';

const regex = /[^A-Za-z _-]/g;
const spaces = / /g;

export const getDecksFromUrl = async (wotcUrl: string): Promise<Result[]> => {
    const results: Result[] = [];
    if (wotcUrl.startsWith("https://magic.wizards.com")) {
        const options = {
            uri: `http://www.whateverorigin.org/get?url=${wotcUrl}`,
            headers: { 'Origin': 'https://feremiyjeenyus.github.io/mtgo-results-scraper/' },
            transform: function (body: string) {
                return cheerio.load(body);
            },
            mode: "no-cors"
        };
        await rp(options)
            .then($ => {
                const usernames: string[] = [];
                $(".deck-group").each(function (this: string) {
                    const headerContent = $(this)
                        .find("h4")
                        .text();
                    const username = headerContent.split(" (")[0];
                    const duplicatePilot = usernames.includes(username)
                    usernames.push(username);
                    const parts = headerContent.split(" (");
                    const name = parts[0];
                    let chaff = "";
                    if (parts[1]) {
                        chaff = parts[1]
                            .replace(regex, "")
                            .replace(spaces, "_")
                            .toLowerCase();
                    }
                    const url = `${wotcUrl}#${name
                        .replace(regex, "")
                        .replace(spaces, "_")
                        .toLowerCase()}${chaff ? "_" + chaff : ""}`;

                    const deck: Deck = {
                        maindeck: [],
                        sideboard: []
                    };
                    $(this).find(".sorted-by-overview-container").find(".row").each(function (this: string) {
                        const name: string = $(this).find(".card-name").text().trim()
                        const info = cardInfo[name] || cardInfo[name.split("//")[0].trim()]
                        deck.maindeck.push(
                            {
                                name,
                                count: parseInt($(this).find(".card-count").text(), 10),
                                highlighted: false,
                                info
                            }
                        )
                    })

                    $(this).find(".sorted-by-sideboard-container").find(".row").each(function (this: string) {
                        const name = $(this).find(".card-name").text().trim()
                        const info = cardInfo[name] || cardInfo[name.split("//")[0].trim()]
                        deck.sideboard.push(
                            {
                                name,
                                count: parseInt($(this).find(".card-count").text(), 10),
                                highlighted: false,
                                info
                            }
                        )
                    })

                    results.push({
                        pilot: username,
                        url: url,
                        deck: deck,
                        duplicatePilot,
                        archetype: ""
                    });
                });

            })
            .catch(err => {
                console.log(err);
                throw (err)
            });
    }
    return results
};
