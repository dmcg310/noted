import express, { Request, Response } from "express";
import mongoose from "mongoose";
import NoteModel from "./models/note";

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

const db = mongoose
	.connect(
		"mongodb+srv://dmcg310:FEY8mH3o4KVuPEKg@notedcluster.mqsns6i.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		app.listen(PORT);
		console.log(`Server started on port ${PORT}`);
	});
