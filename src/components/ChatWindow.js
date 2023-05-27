import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Message } from "./Message";

function ChatWindow() {
	const chat = useSelector((state) => state.chat);
	const chatEndRef = useRef(null);
	let { id } = useParams();
	const conversation = chat.conversations[id];

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [conversation]);

	return (
		<div className="ChatWindow">
			{conversation ? (
				<table>
					<thead>
						<tr>
							<th className="senderColumn" />
							<th />
						</tr>
					</thead>
					<tbody>
						{conversation.messages.map((message, index) => (
							<Message key={index} message={message} />
						))}
					</tbody>
				</table>
			) : (
				"<empty>"
			)}
			<div ref={chatEndRef} />
		</div>
	);
}

export default ChatWindow;
