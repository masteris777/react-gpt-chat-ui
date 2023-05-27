export default function TextAreaInput({ text, setText, handleKeyDown }) {
	return (
		<textarea
			className="input-field"
			value={text}
			onChange={(e) => setText(e.target.value)}
			onKeyDown={handleKeyDown}
		/>
	);
}
