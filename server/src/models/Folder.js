"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const FolderSchema = new mongoose_1.default.Schema({
    name: String,
    user: String,
    created: Date,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note",
        },
    ],
});
const FolderModel = mongoose_1.default.model("Folder", FolderSchema);
exports.default = FolderModel;
