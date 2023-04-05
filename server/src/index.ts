import express, { Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import NoteModel from "./models/Note";
import UserModel from "./models/User";
import cors from "cors";

config();

const PORT = 5000;
const app = express();

const bcrypt = require("bcryptjs");
const saltRounds = 10;

app.use(express.json());
app.use(cors());

// sign up
app.post("/sign-up", async (req: Request, res: Response) => {
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(req.body.password, salt);

	const user = new UserModel({
		email: req.body.email,
		password: hash,
		created: new Date(),
		notes: [],
	});
	const createdUser = await user.save();
	res.json(createdUser);
});

// sign in
app.post("/sign-in", async (req: Request, res: Response) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await UserModel.findOne({ email: email });

	if (user) {
		const isPasswordCorrect = bcrypt.compareSync(password, user.password);
		if (isPasswordCorrect) {
			res.json("Success");
		} else {
			res.json("Incorrect password");
		}
	} else {
		res.json("User not found");
	}
});

// fetch all notes for a user
app.get("/user/notes", async (req: Request, res: Response) => {
	try {
		const userEmail = req.query.email;
		const user = await UserModel.findOne({ email: userEmail });

		if (user) {
			const noteIds = user.notes;
			const notes = await NoteModel.find({ _id: { $in: noteIds } });

			res.json(notes);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// fetch a specific note
app.get("/user/notes/:noteTitle", async (req: Request, res: Response) => {
	try {
		const noteTitle = req.params.noteTitle;
		const note = await NoteModel.findOne({ title: noteTitle });

		if (noteTitle) {
			res.json(note);
		} else {
			res.status(404).json({ message: "Note not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// create note
app.post("/user/create", async (req: Request, res: Response) => {
	try {
		const userEmail = req.body.email;
		const user = await UserModel.findOne({ email: userEmail });

		if (user) {
			const note = new NoteModel({
				title: req.body.title || "",
				content: req.body.content || "",
				user: user,
				folder: req.body.folder || "",
				created: new Date(),
				updated: new Date(),
			});
			const createdNote = await note.save();
			const noteId = createdNote._id;
			user.notes.push(noteId);

			const updatedUser = await user.save();
			res.json(updatedUser);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// TODO: update note

// db connection
const db = mongoose.connect(process.env.MONGO_URL!).then(() => {
	app.listen(PORT);
	console.log(`Server started on port ${PORT}`);
});
