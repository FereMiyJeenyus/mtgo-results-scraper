import { configureStore } from "@reduxjs/toolkit";
import scrapeResultReducer from "./scrapeResultSlice";

export default configureStore({
    reducer: scrapeResultReducer
});
