import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { opendotaApi } from "../services/playerProfile";
import counterReducer from "../features/counter/counterSlice";
import playerReducer from "../features/counter/playerSlice";
import matchReducer from "../features/counter/matchSlice"; // ✅ Now works as default import

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    player: playerReducer,
    match: matchReducer,
    [opendotaApi.reducerPath]: opendotaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(opendotaApi.middleware),
});

setupListeners(store.dispatch);
