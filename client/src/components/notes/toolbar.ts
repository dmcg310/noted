export const Toolbar = {
	options: [
		"inline",
		"fontSize",
		"list",
		"textAlign",
		"colorPicker",
		"link",
		"embedded",
		"emoji",
		"image",
		"history",
	],
	inline: {
		options: ["bold", "italic", "underline", "strikethrough", "monospace"],
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	fontSize: {
		options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
	},
	list: {
		inDropdown: false,
		options: ["unordered", "ordered"],
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	textAlign: {
		inDropdown: true,
		options: ["left", "center", "right"],
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	colorPicker: {
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	link: {
		inDropdown: false,
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	embedded: {
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	emoji: {
		className: "px-2 py-1 text-2xl text-slate-600",
	},
	history: {
		className: "px-2 py-1 text-2xl text-slate-600",
	},
};
