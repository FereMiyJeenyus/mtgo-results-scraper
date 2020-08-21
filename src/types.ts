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
}

export interface CardInfo {
    colors: Color[];
    type: string;
    types: CardType[];
    manaCost: string;
    text: string;
}

export type Color = "W" | "U" | "B" | "R" | "G"
export type CardType = "Creature" | "Land" | "Instant" | "Sorcery" | "Artifact" | "Enchantment" | "Planeswalker"