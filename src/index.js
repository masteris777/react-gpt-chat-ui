import React from "react";
import { Provider } from "react-redux";
import store from "./components/helpers/Store";
import App from "./App";
import { createRoot } from "react-dom/client";
import { fetchAndSetModels } from "./components/helpers/Models";

fetchAndSetModels();

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
