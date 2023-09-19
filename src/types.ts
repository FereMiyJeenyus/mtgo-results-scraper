export interface ScrapeResult {
    id: number;
    mtgoUrl: string;
    eventType: string;
    eventDate: string;
    deckResults: Result[];
    cardCounts: CardCount[];
    numbered: boolean;
}

export interface Deck {
    main: Card[];
    sideboard: Card[];
}

export interface Card {
    name: string;
    count: number;
    highlighted: boolean;
    info?: CardInfo;
}

export interface Result {
    pilot: string;
    url: string;
    deck: Deck;
    duplicatePilot: boolean;
    archetype: string;
    id: number;
    favorite: boolean;
    spicy: boolean;
}

export interface CardInfo {
    colors: Color[];
    faceName: string;
    type: string;
    types: CardType[];
    manaCost: string;
    companion: boolean;
    power: string;
    toughness: string;
    otherHalf: {
        colors: Color[];
        faceName: string;
        type: string;
        types: CardType[];
        manaCost: string;
        text: string;
        power: string;
        toughness: string;
    };
    printings: string[];
}

export interface CardCount {
    card: Card;
    deckCount: number;
}

export type Color = "W" | "U" | "B" | "R" | "G";
export type CardType = "Creature" | "Land" | "Instant" | "Sorcery" | "Artifact" | "Enchantment" | "Planeswalker" | "Battle";

export const setList = [
    { code: "WOE", name: "Wilds of Eldraine" },
    { code: "LTR", name: "Lord of the Rings" },
    { code: "MOM", name: "March of the Machine" },
    { code: "ONE", name: "Phyrexia: All Will Be One" },
    { code: "BRO", name: "The Brothers' War" },
    { code: "DMU", name: "Dominaria United" },
    { code: "SNC", name: "Streets of New Capenna" },
    { code: "NEO", name: "Kamigawa: Neon Dynasty" },
    { code: "VOW", name: "Innistrad: Crimson Vow" },
    { code: "MID", name: "Innistrad: Midnight Hunt" },
    { code: "AFR", name: "Adventures in the Forgotten Realms" },
    { code: "MH2", name: "Modern Horizons 2" },
    { code: "STX", name: "Strixhaven: School of Mages" },
    { code: "KHM", name: "Kaldheim" },
    { code: "ZNR", name: "Zendikar Rising" },
    { code: "M21", name: "Core Set 2021" },
    { code: "IKO", name: "Ikoria: Lair of Behemoths" },
    { code: "THB", name: "Theros Beyond Death" },
    { code: "ELD", name: "Throne of Eldraine" },
    { code: "M20", name: "Core Set 2020" },
    { code: "MH1", name: "Modern Horizons" },
    { code: "WAR", name: "War of the Spark" }
];

export type Format = "standard" | "pioneer" | "modern" | "legacy" | "vintage" | "pauper";

export interface Metagame {
    format: Format;
    archetypes: Archetype[];
}

export interface Archetype {
    id: number;
    name: string;
    prefixColors?: boolean;
    rules: Rule[];
}

export interface Rule {
    cardName: string;
    in: "main" | "side" | "both";
    atLeast?: number;
    atMost?: number;
}

export enum guildMap {
    UW = "Azorius",
    UB = "Dimir",
    UR = "Izzet",
    UG = "Simic",
    BW = "Orzhov",
    BR = "Rakdos",
    BG = "Golgari",
    RG = "Gruul",
    RW = "Boros",
    GW = "Selesnya"
}

export enum shardMap {
    UBR = "Grixis",
    UBG = "Sultai",
    UBW = "Esper",
    URG = "Temur",
    URW = "Jeskai",
    UGW = "Bant",
    BRG = "Jund",
    BRW = "Mardu",
    BGW = "Abzan",
    RGW = "Naya"
}

export const thx = `Direct links courtesy of /u/FereMiyJeenyus and their [MTGO Results Scraper](https://feremiyjeenyus.github.io/mtgo-results-scraper/about). If you've appreciated this post, consider [supporting their cardboard addiction](https://ko-fi.com/feremiyjeenyus).`;
