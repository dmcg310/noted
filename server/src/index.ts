import express, { Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import NoteModel from "./models/Note";
import UserModel from "./models/User";
import cors from "cors";
import FolderModel from "./models/Folder";

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
		const userEmail = req.query.email || req.body.email;
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
app.post("/user/notes/create", async (req: Request, res: Response) => {
	try {
		const userEmail = req.body.userEmail;
		const folderId = req.body.folderId;

		const user = await UserModel.findOne({ email: userEmail });
		const folder = await FolderModel.findOne({ _id: folderId });

		if (user && folder) {
			const note = new NoteModel({
				title: req.body.title,
				content: req.body.content,
				user: userEmail,
				folder: req.body.folderId,
				created: new Date(),
				updated: new Date(),
			});

			const createdNote = await note.save();
			const noteId = createdNote._id;
			user.notes.push(noteId);
			folder.notes.push(noteId);

			await user.save();
			await folder.save();

			res.json(createdNote);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// edit note
app.put("/user/:noteTitle/edit", async (req: Request, res: Response) => {
	try {
		const noteTitle = req.params.noteTitle;

		const note = await NoteModel.findOne({ title: noteTitle });

		if (note) {
			note.title = req.body.title || note.title;
			note.content = req.body.content || note.content;

			const updatedNote = await note.save();
			res.json(updatedNote);
		} else {
			res.status(404).json({ message: "Note not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// delete note
app.delete("/user/:noteTitle/delete", async (req: Request, res: Response) => {
	try {
		const noteTitle = req.body.noteTitle;

		const exists = await NoteModel.findOne({ title: noteTitle });

		if (exists) {
			const note = await NoteModel.deleteOne({ title: noteTitle });

			res.json(note);
		} else {
			res.status(404).json({ message: "Note not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// new folder
app.post("/user/folders/create", async (req: Request, res: Response) => {
	try {
		const userEmail = req.query.email || req.body.email;
		const user = await UserModel.findOne({ email: userEmail });

		if (user) {
			const folder = new FolderModel({
				name: req.body.name,
				user: userEmail,
				created: new Date(),
				notes: [],
			});

			const createdFolder = await folder.save();
			res.json(createdFolder);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// new note in folder
app.post("/user/folders/:folderId/create", async (req: Request, res: Response) => {
	try {
		const userEmail = req.query.email || req.body.email;
		const folderId = req.params.folderId;

		const [user, folder] = await Promise.all([
			UserModel.findOne({ email: userEmail }).lean(),
			FolderModel.findOne({ _id: folderId }).lean(),
		]);

		if (user && folder) {
			const note = new NoteModel({
				title: req.body.title,
				content: req.body.content,
				user: userEmail,
				folder: folderId,
				created: new Date(),
				updated: new Date(),
			});

			const createdNote = await note.save();
			const noteId = createdNote._id;
			user.notes.push(noteId);
			folder.notes.push(noteId);

			const updatedUser = await UserModel.findOneAndUpdate({ email: userEmail }, user);
			const updatedFolder = await FolderModel.findOneAndUpdate({ _id: folderId }, folder);

			res.json({ user: updatedUser, folder: updatedFolder });
		} else {
			res.status(404).json({ message: "User or folder not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// fetch all folders for a user
app.get("/user/folders", async (req: Request, res: Response) => {
	try {
		const userEmail = req.query.email || req.body.email;

		const user = await UserModel.findOne({ email: userEmail });

		const folders = await FolderModel.find({ user: userEmail });

		if (user) {
			res.json(folders);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// view notes in a folder
app.get("/user/folders/:folderId", async (req: Request, res: Response) => {
	try {
		const userEmail = req.query.email || req.body.email;
		const folderId = req.params.folderId;

		const [user, folder] = await Promise.all([
			UserModel.findOne({ email: userEmail }).lean(),
			FolderModel.findOne({ _id: folderId }).lean(),
		]);

		if (user && folder) {
			const folderNotesArray = folder.notes;

			const notes = await NoteModel.find({ _id: { $in: folderNotesArray } });

			res.json(notes);
		} else {
			res.status(404).json({ message: "User or folder not found" });
		}
	} catch (error) {
		console.log(error);
	}
});

// db connection
mongoose.connect(process.env.MONGO_URL!).then(() => {
	app.listen(PORT);
	console.log(`Server started on port ${PORT}`);
});
