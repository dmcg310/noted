import { useLocation, useNavigate } from "react-router-dom";
import SignOut from "../login/SignOut";
import { auth } from "../../../firebase/firebaseConfig";
import deleteAccount from "../../api/login/deleteAccount";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useState } from "react";
import ViewFolders from "../folders/ViewFolders";

const User = () => {
	const [showProfile, setShowProfile] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();

	const userEmail = location.state?.userEmail;

	const viewNotes = () => {
		navigate("/user/folders", { state: { userEmail } });
	};

	const viewProfile = () => {
		setShowProfile(!showProfile);
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

	const currentYear = new Date().getFullYear();

	return (
		<div>
			<div
				id="user-header"
				className="w-screen flex justify-between p-2.5 pl-3 fixed bg-white"
				style={{ alignItems: "center" }}
			>
				<button
					className="text-3xl text-slate-600 bg-slate-100 hover:bg-slate-200 text py-2 px-4 rounded-md transition ease-in duration-100 shadow-md"
					onClick={() => navigate("/")}
				>
					noted.
				</button>
				<div>
					<button
						className="text-slate-600 mr-3 text-2xl hover:text-slate-400 text rounded-md transition ease-in duration-100"
						onClick={viewProfile}
					>
						Profile
					</button>
				</div>
			</div>
			<div className="h-screen bg-slate-200">
				<div className="flex align-middle justify-center w-screen h-auto">
					{/* profile view */}
					<ViewFolders />
					{showProfile && (
						<div className="w-auto h-auto bg-white rounded-md shadow-lg p-10 mt-20">
							<h1 className="text-5xl px-4 pb-4 text-slate-600">Profile</h1>
							<hr />
							<p className="py-3 px-4 text-3xl text-slate-600">
								{userEmail}
							</p>
							<button
								name="sign-out"
								id="sign-out"
								onClick={SignOut}
								className="bg-blue-400 px-8 py-4 text-white ml-3 text-2xl hover:bg-blue-300 text rounded-md transition ease-in duration-100"
							>
								Sign Out
							</button>
							<button
								name="delete-account"
								id="delete-account"
								onClick={deleteUser}
								className="bg-red-500 px-8 py-4 text-white ml-3 text-2xl hover:bg-red-400 text rounded-md transition ease-in duration-100"
							>
								Delete Account
							</button>
							<button
								name="close"
								id="close"
								onClick={() => setShowProfile(false)}
								className="mt-3 bg-gray-400 px-8 py-4 text-white ml-3 text-2xl hover:bg-gray-300 text rounded-md transition ease-in duration-100"
							>
								Close
							</button>
						</div>
					)}
				</div>
				<footer className="fixed bottom-0 w-full">
					<p className="text-slate-500 ml-2">Darragh McGurk - {currentYear}</p>
				</footer>
			</div>
		</div>
	);
};

export default User;
