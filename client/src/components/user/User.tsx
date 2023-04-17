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
					className="px-4 py-2 text-3xl transition duration-100 ease-in rounded-md shadow-md text-slate-600 bg-slate-100 hover:bg-slate-200 text"
					onClick={() => navigate("/")}
				>
					noted.
				</button>
				<div>
					<button
						className="mr-3 text-2xl transition duration-100 ease-in rounded-md text-slate-600 hover:text-slate-400 text"
						onClick={viewProfile}
					>
						Profile
					</button>
				</div>
			</div>
			<div className="h-screen bg-slate-200">
				<div className="flex justify-center w-screen h-auto align-middle">
					{/* profile view */}
					<ViewFolders />
					{showProfile && (
						<div className="w-auto p-10 mt-20 bg-white rounded-md shadow-lg h-max">
							<h1 className="px-4 pb-4 text-5xl text-slate-600">Profile</h1>
							<hr />
							<p className="px-4 py-3 text-3xl text-slate-600">
								{userEmail}
							</p>
							<button
								name="sign-out"
								id="sign-out"
								onClick={SignOut}
								className="px-8 py-4 ml-3 text-2xl text-white transition duration-100 ease-in bg-blue-400 rounded-md shadow-lg hover:bg-blue-300 text"
							>
								Sign Out
							</button>
							<button
								name="delete-account"
								id="delete-account"
								onClick={deleteUser}
								className="px-8 py-4 ml-3 text-2xl text-white transition duration-100 ease-in bg-red-500 rounded-md shadow-lg hover:bg-red-400 text"
							>
								Delete Account
							</button>
							<button
								name="close"
								id="close"
								onClick={() => setShowProfile(false)}
								className="px-8 py-4 mt-3 ml-3 text-2xl text-white transition duration-100 ease-in bg-gray-400 rounded-md shadow-lg hover:bg-gray-300 text"
							>
								Close
							</button>
						</div>
					)}
				</div>
				<footer className="fixed bottom-0 w-full">
					<p className="ml-2 text-slate-500">Darragh McGurk - {currentYear}</p>
				</footer>
			</div>
		</div>
	);
};

export default User;
