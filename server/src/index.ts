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

// get all notes
app.get("/notes", async (req: Request, res: Response) => {
	const notes = await NoteModel.find();
	res.json(notes);
});

// TODO:get notes by user id

// get note by id
app.get("/notes/:id", async (req: Request, res: Response) => {
	const note = await NoteModel.findById(req.params.id);
	res.json(note);
});

// create note
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

// TODO:update note by id

// delete note by id
app.delete("/notes/delete/:id", async (req: Request, res: Response) => {
	const note = await NoteModel.findByIdAndDelete(req.params.id);
	res.json(note);
});

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

// db connection
const db = mongoose.connect(process.env.MONGO_URL!).then(() => {
	app.listen(PORT);
	console.log(`Server started on port ${PORT}`);
});
