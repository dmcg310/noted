import express, { Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import NoteModel from "./models/note";
import cors from "cors";

config();

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.post("/notes/create", async (req: Request, res: Response) => {
	const note = new NoteModel({
		title: req.body.title || "",
		content: req.body.content || "",
		user: req.body.user || "",
		folder: req.body.folder || "",
		created: new Date(),
		updated: new Date(),
	});
	const createdNote = await note.save();
	res.json(createdNote);
});

app.get("/notes", async (req: Request, res: Response) => {
	const notes = await NoteModel.find();
	res.json(notes);
});

app.get("/notes/:id", async (req: Request, res: Response) => {
	const note = await NoteModel.findById(req.params.id);
	res.json(note);
});

app.delete("/notes/delete/:id", async (req: Request, res: Response) => {
	const note = await NoteModel.findByIdAndDelete(req.params.id);
	res.json(note);
});

const db = mongoose.connect(process.env.MONGO_URL!).then(() => {
	app.listen(PORT);
	console.log(`Server started on port ${PORT}`);
});
