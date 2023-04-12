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
    try {
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
    } catch (error) {
        console.log(error);
    }
});

// sign in
app.post("/sign-in", async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
});

// fetch a specific note
app.get("/user/notes/:noteId", async (req: Request, res: Response) => {
    try {
        const noteId = req.params.noteId;
        const note = await NoteModel.findOne({ _id: noteId });

        if (noteId) {
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
app.put("/user/notes/:noteId/edit", async (req: Request, res: Response) => {
    try {
        const noteId = req.body.noteId;

        const note = await NoteModel.findOne({ _id: noteId });

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
        const noteId = req.body.noteId;
        const userEmail = req.body.user;
        const folderId = req.body.folderId;

        const [user, note, folder] = await Promise.all([
            UserModel.findOne({ email: userEmail }),
            NoteModel.findOne({ _id: noteId }),
            FolderModel.findOne({ _id: folderId }),
        ]);

        if (user && note && folder) {
            const folderIndex = folder.notes.indexOf(noteId);
            const noteIndex = user.notes.indexOf(noteId);

            user.notes.splice(noteIndex, 1);
            folder.notes.splice(folderIndex, 1);

            await user.save();
            await folder.save();

            await note.deleteOne();

            res.json({ message: "Note deleted", note });
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

// delete folder
app.delete("/user/folders", async (req: Request, res: Response) => {
    try {
        const folderId = req.body.folderId;

        const folder = await FolderModel.findOne({ _id: folderId });

        if (folder) {
            const folderNotesArray = folder.notes;

            await NoteModel.deleteMany({ _id: { $in: folderNotesArray } });
            await folder.deleteOne();
            res.json({ message: "Folder deleted" });
        } else {
            res.status(404).json({ message: "Folder not found" });
        }
    } catch (error) {
        console.log(error);
    }
});

// db connection
mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log("Connecting!");
    try {
        app.listen(PORT);
        console.log(`Server started on port ${PORT}!`);
    } catch (error) {
        console.log(error);
        console.log("Server failed to start");
    }
});
