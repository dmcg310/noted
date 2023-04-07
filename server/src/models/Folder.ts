import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FolderSchema = new mongoose.Schema({
	name: String,
	user: String,
	created: Date,
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note",
		},
	],
});

const FolderModel = mongoose.model("Folder", FolderSchema);

export default FolderModel;
