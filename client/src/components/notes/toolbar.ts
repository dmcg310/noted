export const toolbar = {
	options: ["inline", "blockType", "list", "textAlign"],
	inline: {
		options: [
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"monospace",
			"superscript",
			"subscript",
		],
	},
	blockType: {
		inDropdown: false,
		options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"],
	},
	list: {
		inDropdown: false,
		options: ["unordered", "ordered", "indent", "outdent"],
	},
	textAlign: {
		inDropdown: false,
		options: ["left", "center", "right", "justify"],
	},
	history: {
		inDropdown: false,
		options: ["undo", "redo"],
	},
};
