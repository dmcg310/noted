"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const NoteSchema = new Schema({
    title: String,
    content: String,
    user: String,
    folder: String,
    created: Date,
    updated: Date,
});
const NoteModel = mongoose_1.default.model("Note", NoteSchema);
exports.default = NoteModel;
