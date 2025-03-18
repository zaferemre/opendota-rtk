import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PlayerSearchForm from "./components/PlayerSearchForm";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PlayerSearchForm />
      </div>
    </Provider>
  );
}

export default App;
