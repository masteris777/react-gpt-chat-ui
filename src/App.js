import "./App.css";
import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import ChatHistory from "./components/ChatHistory";
import ChatWindow from "./components/ChatWindow";
import ModelSelector from "./components/ModelSelector";
import TextInput from "./components/TextInput";
import { useSelector } from "react-redux";

function App() {
	const chat = useSelector((state) => state.chat);
	const history = chat.chatHistory;
	let id;
	if (history.length === 0) {
		//new conversation
	} else {
		id = history[0].id;
	}
	return (
		<Router>
			<div className="App">
				{/* <ChatHistory /> */}
				<Routes>
					<Route
						path="/models/:model/conversations/:id"
						element={<ChatHistory />}
					/>
				</Routes>
				<div className="Main">
					<Routes>
						<Route
							path="/models/:model/conversations/:id"
							element={<ModelSelector />}
						/>
					</Routes>
					<Routes>
						<Route
							path="/models/:model/conversations/:id"
							element={<ChatWindow />}
						/>
						<Route
							path="/"
							element={<Navigate to={`/models/default/conversations/${id}`} />}
						/>
					</Routes>
					{/* <TextInput /> */}
					<Routes>
						<Route
							path="/models/:model/conversations/:id"
							element={<TextInput />}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
