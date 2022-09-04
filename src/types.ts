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
    index: number;
    favorite: boolean;
    spicy: boolean;
}

export interface CardInfo {
    colors: Color[];
    faceName: string;
    type: string;
    types: CardType[];
    manaCost: string;
    text: string;
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
export type CardType = "Creature" | "Land" | "Instant" | "Sorcery" | "Artifact" | "Enchantment" | "Planeswalker";

export const setList = [
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
