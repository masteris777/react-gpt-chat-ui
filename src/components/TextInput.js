import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

import { addMessage, appendResponse, selectModel } from "./helpers/ChatSlice";
import { fetchFromAPI } from "./helpers/API";
import { createSummary } from "./helpers/Summary";
import TextAreaInput from "./TextAreaInput";

export default function TextInput() {
	const [text, setText] = useState("");
	const dispatch = useDispatch();
	let { id, model } = useParams();
	const chat = useSelector((state) => state.chat);
	model = selectModel(chat.models, model);
	const conversation = chat.conversations[id];

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			setText(text + "\n");
		}
	};

	const reader = useRef(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (checkIfOngoingAndStop(reader)) return;

		if (text.trim() !== "" && conversation) {
			const newConversation = cloneDeep(conversation);
			const message = { sender: "user", text, end: true };
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
						if (reader.current) {
							dispatch(appendResponse({ id, chunk: "", model, end: true }));
							reader.current = false;
						}
						createSummary(newConversation, dispatch);
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
					handleKeyPress={handleKeyDown}
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

function checkIfOngoingAndStop(reader) {
	if (reader.current) {
		reader.current.cancel();
		reader.current = false;
		return true;
	} else return false;
}
