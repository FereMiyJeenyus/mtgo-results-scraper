export interface Deck {
    maindeck: Card[];
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
}

export type Color = "W" | "U" | "B" | "R" | "G";
export type CardType = "Creature" | "Land" | "Instant" | "Sorcery" | "Artifact" | "Enchantment" | "Planeswalker";
