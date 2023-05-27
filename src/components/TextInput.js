import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
	addMessage,
	appendResponse,
	tagConversation,
	selectModel,
} from "./ChatSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { cloneDeep } from "lodash";

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
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/summaries`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(conversation),
				}
			);
			const { summary } = await response.json();

			dispatch(tagConversation({ id: conversation.id, tag: summary }));
		} catch (error) {
			console.error("Error fetching summaries:", error);
		}
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
			try {
				const newConversation = cloneDeep(conversation);
				const message = { sender: "user", text };
				dispatch(addMessage({ id, message }));
				newConversation.messages.push(message);

				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/models/${model}/conversations`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(newConversation),
					}
				);

				// Check if the request was successful
				if (response.ok) {
					reader.current = response.body.getReader();
					const decoder = new TextDecoder("utf-8");

					// Define recursive function to process the stream
					const processStream = ({ done, value }) => {
						if (done) {
							reader.current = false;
							createSummary(newConversation);
							return;
						}

						const base64Str = decoder.decode(value);
						const chunk = atob(base64Str);

						dispatch(appendResponse({ id, chunk, model }));

						// Continue processing
						reader.current.read().then(processStream);
					};

					// Start processing
					reader.current.read().then(processStream);
				} else {
					console.error("Server response was not ok.");
				}
			} catch (error) {
				console.error("Fetch error: ", error);
			}

			setText("");
		}
	};

	return (
		<div className="TextInput">
			<form onSubmit={handleSubmit}>
				<textarea
					className="input-field"
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyPress={handleKeyPress}
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
