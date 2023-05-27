import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";

function ChatWindow() {
	const chat = useSelector((state) => state.chat);
	const chatEndRef = useRef(null);
	let { id } = useParams();
	const conversation = chat.conversations[id];

	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom);

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
							<tr key={index}>
								<td className="senderCell">
									{message.model ? message.model : message.sender}
								</td>
								<td className="textCell">
									<div className="markdown-content">
										<ReactMarkdown>{message.text}</ReactMarkdown>
									</div>
								</td>
							</tr>
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
