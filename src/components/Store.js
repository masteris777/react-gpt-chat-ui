import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./ChatSlice";

export default configureStore({
	reducer: {
		chat: chatReducer,
	},
});
