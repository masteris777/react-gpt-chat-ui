import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	chatHistory: JSON.parse(localStorage.getItem("chatHistory")) || [],
	conversations: JSON.parse(localStorage.getItem("conversations")) || {},
	models: JSON.parse(localStorage.getItem("models")) || [
		{
			name: "default",
		},
	],
};
// localStorage.clear();

const cleanConversations = (state) => {
	const conversations = {};
	state.chatHistory.forEach((chat) => {
		conversations[chat.id] = state.conversations[chat.id];
	});
	state.conversations = conversations;
};

const ensureHistorySize = (state, size) => {
	if (state.chatHistory.length > size) {
		state.chatHistory = state.chatHistory.slice(0, size);
		cleanConversations(state);
	}
};

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		tagConversation: (state, action) => {
			const { id, tag } = action.payload;
			state.conversations[id].tag = tag;
			state.chatHistory.forEach((chat) => {
				if (chat.id === id) {
					chat.tag = tag;
				}
			});
			localStorage.setItem("chatHistory", JSON.stringify(state.chatHistory));
			localStorage.setItem(
				"conversations",
				JSON.stringify(state.conversations)
			);
		},
		addConversation: (state, action) => {
			const conversation = action.payload;
			state.chatHistory.unshift({ tag: conversation.tag, id: conversation.id });
			state.conversations[conversation.id] = conversation;
			ensureHistorySize(state, 5);
			localStorage.setItem("chatHistory", JSON.stringify(state.chatHistory));
			localStorage.setItem(
				"conversations",
				JSON.stringify(state.conversations)
			);
		},
		addMessage: (state, action) => {
			const { id, message } = action.payload;
			if (!state.conversations[id]) {
				state.conversations[id] = [];
			}
			state.conversations[id].messages.push(message);
			localStorage.setItem(
				"conversations",
				JSON.stringify(state.conversations)
			);
		},
		appendResponse: (state, action) => {
			const { id, chunk, model, end } = action.payload;
			if (state.conversations[id]) {
				const l = state.conversations[id].messages.length;
				let message = state.conversations[id].messages[l - 1];
				if (!message || message.sender !== "model") {
					message = { sender: "model", model, text: "", end };
					state.conversations[id].messages.push(message);
				}
				message.text += chunk;
				message.end = end;
				localStorage.setItem(
					"conversations",
					JSON.stringify(state.conversations)
				);
			}
		},
	},
});

export const selectModel = (chatModels, model) => {
	let models = chatModels.map((model) => model.name);
	return models.indexOf(model) === -1 ? (model = models[0]) : model;
};

export const { addConversation, addMessage, appendResponse, tagConversation } =
	chatSlice.actions;

export default chatSlice.reducer;
