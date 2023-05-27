import React from "react";
import ReactMarkdown from "react-markdown";

// This component will render a single message
export function Message({ message }) {
	return (
		<tr>
			<td className="senderCell">
				{message.model ? message.model : message.sender}
			</td>
			<td className="textCell">
				<div className="markdown-content">
					<ReactMarkdown>{message.text}</ReactMarkdown>
				</div>
			</td>
		</tr>
	);
}
