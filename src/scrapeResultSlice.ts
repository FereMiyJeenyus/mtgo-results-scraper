import { createSlice } from "@reduxjs/toolkit";
import { ScrapeResult } from "./types";

export const scrapeResultSlice = createSlice({
    name: "scrapeResults",
    initialState: {
        scrapeResults: [] as ScrapeResult[]
    },
    reducers: {
        pushScrapeResult: (state, action) => {
            state.scrapeResults.push(action.payload);
        },
        updateScrapeResult: (state, action) => {
            const results = [...state.scrapeResults];
            results[action.payload.id] = action.payload;
            state.scrapeResults = results;
        },
        clearResults: (state) => {
            state.scrapeResults = [];
        }
    }
});

// Action creators are generated for each case reducer function
export const { pushScrapeResult, updateScrapeResult, clearResults } = scrapeResultSlice.actions;

export const selectScrapeResults = (state: { scrapeResults: ScrapeResult[] }): ScrapeResult[] => state.scrapeResults;
export default scrapeResultSlice.reducer;
