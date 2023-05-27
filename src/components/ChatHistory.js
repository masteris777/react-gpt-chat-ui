import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addConversation } from "./ChatSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
		let str = conversation.tag || `unknown-${conversation.id}`;
		return str.length <= length ? str : str.slice(0, length - 3) + "...";
	}
	const handleNewConversationClick = () => {
		// Logic to create a new conversation
		const id = uuidv4();
		const conversation = { id, messages: [] };
		dispatch(addConversation(conversation));

		// Navigate to the new conversation

		navigate("/models/default/conversations/" + id);
	};
	return (
		<div className="ChatHistory">
			<div className="new-chat">
				<button onClick={handleNewConversationClick}>+ new chat</button>
			</div>
			{chatHistory.map((conversation, index) => (
				<div
					className={`chat ${id === conversation.id ? "selected" : ""}`}
					key={index}
				>
					<a href={"/models/default/conversations/" + conversation.id}>
						{deriveTag(conversation, 20)}
					</a>
				</div>
			))}
		</div>
	);
}

export default ChatHistory;
