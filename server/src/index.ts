import express, { Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import NoteModel from "./models/note";

config();

const PORT = 5000;
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.post("/notes", async (req: Request, res: Response) => {
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

const db = mongoose.connect(process.env.MONGO_URL!).then(() => {
	app.listen(PORT);
	console.log(`Server started on port ${PORT}`);
});
