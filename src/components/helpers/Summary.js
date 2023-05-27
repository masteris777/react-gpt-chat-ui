import { fetchFromAPI } from "./API";
import { tagConversation } from "./ChatSlice";

export const createSummary = async (conversation, dispatch) => {
	if (conversation.tag) return;

	const response = await fetchFromAPI(
		`${process.env.REACT_APP_API_URL}/summaries`,
		"POST",
		conversation
	);

	const { summary } = await response.json();

	dispatch(tagConversation({ id: conversation.id, tag: summary }));
};
