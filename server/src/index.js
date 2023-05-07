"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const Note_1 = __importDefault(require("./models/Note"));
const User_1 = __importDefault(require("./models/User"));
const cors_1 = __importDefault(require("cors"));
const Folder_1 = __importDefault(require("./models/Folder"));
(0, dotenv_1.config)();
const PORT = 5000;
const app = (0, express_1.default)();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// sign up
app.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User_1.default({
            email: req.body.email,
            password: hash,
            created: new Date(),
            notes: [],
        });
        const createdUser = yield user.save();
        res.json(createdUser);
    }
    catch (error) {
        console.log(error);
    }
}));
// sign in
app.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (isPasswordCorrect) {
                res.json("Success");
            }
            else {
                res.json("Incorrect password");
            }
        }
        else {
            res.json("User not found");
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// delete account
app.delete("/user/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (user) {
            const notes = user.notes;
            yield Note_1.default.deleteMany({ _id: { $in: notes } });
            yield User_1.default.deleteOne({ email: userEmail });
            yield Folder_1.default.deleteMany({ user: userEmail });
            res.status(200).json({ message: "User deleted" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// fetch all notes for a user
app.get("/user/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.query.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (user) {
            // find all notes for a user
            const notes = yield Note_1.default.find({ user: userEmail });
            res.json(notes);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// fetch a specific note
app.get("/user/notes/:noteId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.params.noteId;
        const note = yield Note_1.default.findOne({ _id: noteId });
        if (noteId) {
            res.json(note);
        }
        else {
            res.status(404).json({ message: "Note not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// create note
app.post("/user/notes/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const folderId = req.body.folderId;
        const user = yield User_1.default.findOne({ email: userEmail });
        const folder = yield Folder_1.default.findOne({ _id: folderId });
        if (user && folder) {
            const note = new Note_1.default({
                title: req.body.title,
                content: req.body.content,
                user: userEmail,
                folder: req.body.folderId,
                created: new Date(),
                updated: new Date(),
            });
            const createdNote = yield note.save();
            const noteId = createdNote._id;
            user.notes.push(noteId);
            folder.notes.push(noteId);
            yield user.save();
            yield folder.save();
            res.json(createdNote);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// edit note
app.put("/user/notes/:noteId/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.body.noteId;
        const note = yield Note_1.default.findOne({ _id: noteId });
        if (note) {
            note.title = req.body.title || note.title;
            note.content = req.body.content || note.content;
            const updatedNote = yield note.save();
            res.json(updatedNote);
        }
        else {
            res.status(404).json({ message: "Note not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// delete note
app.delete("/user/:noteId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.body.noteId;
        const userEmail = req.body.user;
        const folderId = req.body.folderId;
        const [user, note, folder] = yield Promise.all([
            User_1.default.findOne({ email: userEmail }),
            Note_1.default.findOne({ _id: noteId }),
            Folder_1.default.findOne({ _id: folderId }),
        ]);
        if (user && note && folder) {
            const folderIndex = folder.notes.indexOf(noteId);
            const noteIndex = user.notes.indexOf(noteId);
            user.notes.splice(noteIndex, 1);
            folder.notes.splice(folderIndex, 1);
            yield user.save();
            yield folder.save();
            yield note.deleteOne();
            res.json({ message: "Note deleted", note });
        }
        else {
            res.status(404).json({ message: "Note not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// new folder
app.post("/user/folders/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.query.email || req.body.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        if (user) {
            const folder = new Folder_1.default({
                name: req.body.name,
                user: userEmail,
                created: new Date(),
                notes: [],
            });
            const createdFolder = yield folder.save();
            res.json(createdFolder);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// fetch all folders for a user
app.get("/user/folders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.query.email || req.body.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        const folders = yield Folder_1.default.find({ user: userEmail });
        if (user) {
            res.json(folders);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// view notes in a folder
app.get("/user/folders/:folderId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.query.email || req.body.email;
        const folderId = req.params.folderId;
        const [user, folder] = yield Promise.all([
            User_1.default.findOne({ email: userEmail }).lean(),
            Folder_1.default.findOne({ _id: folderId }).lean(),
        ]);
        if (user && folder) {
            const folderNotesArray = folder.notes;
            const notes = yield Note_1.default.find({ _id: { $in: folderNotesArray } });
            res.json(notes);
        }
        else {
            res.status(404).json({ message: "User or folder not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// delete folder
app.delete("/user/folders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderId = req.body.folderId;
        const folder = yield Folder_1.default.findOne({ _id: folderId });
        if (folder) {
            const folderNotesArray = folder.notes;
            yield Note_1.default.deleteMany({ _id: { $in: folderNotesArray } });
            yield User_1.default.updateMany({}, { $pull: { notes: { $in: folderNotesArray } } });
            yield folder.deleteOne();
            res.json({ message: "Folder deleted" });
        }
        else {
            res.status(404).json({ message: "Folder not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
// db connection
mongoose_1.default.connect(process.env.MONGO_URL).then(() => {
    console.log("Connecting!");
    try {
        app.listen(PORT);
        console.log(`Server started on port ${PORT}!`);
    }
    catch (error) {
        console.log(error);
        console.log("Server failed to start");
    }
});
