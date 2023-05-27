import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

import {
	addMessage,
	appendResponse,
	tagConversation,
	selectModel,
} from "./ChatSlice";

// Helper function for fetch calls
async function fetchFromAPI(url, method, body) {
	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		return response;
	} catch (error) {
		console.error(`Error fetching ${url}:`, error);
	}
}

// Function component to handle textarea input
function TextAreaInput({ text, setText, handleKeyPress }) {
	return (
		<textarea
			className="input-field"
			value={text}
			onChange={(e) => setText(e.target.value)}
			onKeyPress={handleKeyPress}
		/>
	);
}

function TextInput() {
	const [text, setText] = useState("");
	const dispatch = useDispatch();
	let { id, model } = useParams();
	const chat = useSelector((state) => state.chat);
	model = selectModel(chat.models, model);
	const conversation = chat.conversations[id];

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			setText(text + "\n");
		}
	};

	const reader = useRef(false);

	const createSummary = async (conversation) => {
		if (conversation.tag) return;

		const response = await fetchFromAPI(
			`${process.env.REACT_APP_API_URL}/summaries`,
			"POST",
			conversation
		);

		const { summary } = await response.json();

		dispatch(tagConversation({ id: conversation.id, tag: summary }));
	};

	const checkIfOngoingAndStop = () => {
		if (reader.current) {
			reader.current.cancel();
			reader.current = false;
			return true;
		} else return false;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (checkIfOngoingAndStop()) return;

		if (text.trim() !== "" && conversation) {
			const newConversation = cloneDeep(conversation);
			const message = { sender: "user", text };
			dispatch(addMessage({ id, message }));
			newConversation.messages.push(message);

			const response = await fetchFromAPI(
				`${process.env.REACT_APP_API_URL}/models/${model}/conversations`,
				"POST",
				newConversation
			);

			if (response.ok) {
				reader.current = response.body.getReader();
				const decoder = new TextDecoder("utf-8");

				const processStream = ({ done, value }) => {
					if (done) {
						reader.current = false;
						createSummary(newConversation);
						return;
					}

					const base64Str = decoder.decode(value);
					const chunk = atob(base64Str);

					dispatch(appendResponse({ id, chunk, model }));
					reader.current.read().then(processStream);
				};

				reader.current.read().then(processStream);
			} else {
				console.error("Server response was not ok.");
			}

			setText("");
		}
	};

	return (
		<div className="TextInput">
			<form onSubmit={handleSubmit}>
				<TextAreaInput
					text={text}
					setText={setText}
					handleKeyPress={handleKeyPress}
				/>
				<div
					className={
						reader.current ? "stop-generation-icon" : "submit-question-icon"
					}
				>
					<button type="submit"></button>
				</div>
			</form>
		</div>
	);
}

export default TextInput;
