import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: String,
	password: String,
	created: Date,
	notes: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note",
		},
	],
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
