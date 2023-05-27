import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addConversation } from "./helpers/ChatSlice";

function ChatHistory() {
	const chat = useSelector((state) => state.chat);
	const chatHistory = chat.chatHistory;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		// You could add a listener for the 'storage' event here to handle changes to localStorage made by other tabs
	}, []);

	function deriveTag(conversation, length = 20) {
		const str = conversation.tag || `unknown-${conversation.id}`;
		return str.length <= length ? str : `${str.slice(0, length - 3)}...`;
	}

	const handleNewConversationClick = () => {
		// Logic to create a new conversation
		const id = uuidv4();
		const conversation = { id, messages: [] };
		dispatch(addConversation(conversation));

		// Navigate to the new conversation
		navigate(`/models/default/conversations/${id}`);
	};

	return (
		<div className="ChatHistory">
			<div className="new-chat">
				<button onClick={handleNewConversationClick}>+ new chat</button>
			</div>
			{chatHistory.map((conversation) => (
				<div
					className={`chat ${id === conversation.id ? "selected" : ""}`}
					key={conversation.id}
				>
					<a href={`/models/default/conversations/${conversation.id}`}>
						{deriveTag(conversation, 20)}
					</a>
				</div>
			))}
		</div>
	);
}

export default ChatHistory;
