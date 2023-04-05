import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
	title: String,
	content: String,
	user: String,
	folder: String,
	created: Date,
	updated: Date,
});

const NoteModel = mongoose.model("Note", NoteSchema);

export default NoteModel;
