import { useLocation, useNavigate } from "react-router-dom";
import SignOut from "../login/SignOut";
import { FirebaseApp } from "firebase/app";
import { auth } from "../../../firebase/firebaseConfig";
import deleteAccount from "../../api/login/deleteAccount";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const User = () => {
	const navigate = useNavigate();

	const location = useLocation();
	const userEmail = location.state?.userEmail;

	const viewNotes = () => {
		navigate("/user/folders", { state: { userEmail } });
	};

	const deleteUser = async () => {
		const user = auth.currentUser;
		const password = prompt("Enter your password to delete your account");

		const credential = EmailAuthProvider.credential(user?.email!, password!);

		await reauthenticateWithCredential(user!, credential);

		user?.delete().then(async () => {
			const response = await deleteAccount(userEmail);

			if (response !== null) {
				navigate("/");
				alert("Account deleted");
			} else {
				alert("Error deleting account");
			}
		});
	};
	return (
		<div>
			<h1>Welcome, {userEmail}</h1>
			<button name="view-notes" id="view-notes" onClick={viewNotes}>
				View Notes
			</button>
			<SignOut />
			<button name="delete-account" id="delete-account" onClick={deleteUser}>
				Delete Account
			</button>
		</div>
	);
};

export default User;
