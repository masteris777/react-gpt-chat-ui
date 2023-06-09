import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectModel } from "./helpers/ChatSlice";

function ModelSelector() {
	let { model, id } = useParams();
	const navigate = useNavigate();
	const chat = useSelector((state) => state.chat);
	const models = chat.models;
	model = selectModel(models, model);

	const handleModelSelection = (name) => {
		navigate(`/models/${name}/conversations/${id}`);
	};

	return (
		<div className="ModelSelector">
			<div className="model-icons">
				{models.map((m, index) => (
					<div
						className={`model-icon ${m.name === model ? "selected" : ""}`}
						onClick={() => handleModelSelection(m.name)}
						key={index}
					>
						{m.name}
					</div>
				))}
			</div>
		</div>
	);
}

export default ModelSelector;
