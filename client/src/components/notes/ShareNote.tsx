import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import shareNote from "../../api/notes/shareNote";
import userExists from "../../api/login/userExists";

const ShareNote = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const noteId = location.state?.noteId;
	const userEmail = location.state?.userEmail;

	const [email, setEmail] = useState("");

	const handleShare = async (e: React.FormEvent) => {
		e.preventDefault();
		// Check if user exists
		const userExistsRes = await userExists(email);

		if (userExistsRes) {
			// Share note
			const shareNoteRes = await shareNote({
				noteId,
				email,
			});

			if (shareNoteRes) {
				document.getElementById("success")!.style.display = "block";

				setTimeout(() => {
					navigate("/");
				}, 2000);
			}
		} else {
			document.getElementById("invalid-email")!.style.display = "block";
		}
	};

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
			</div>
			<div className="flex items-center justify-center h-screen bg-slate-200">
				<div className="w-1/3 h-auto p-8 bg-white rounded-md shadow-lg max-md:w-5/6">
					<h1 className="pb-3 text-3xl text-slate-700">Share Note</h1>
					<p
						id="invalid-email"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						No user with that email!
					</p>
					<p
						id="success"
						style={{ display: "none" }}
						className="text-2xl text-emerald-500"
					>
						Note shared!
					</p>
					<form onSubmit={handleShare}>
						<div className="flex flex-col">
							<label htmlFor="email" className="text-1xl text-slate-700">
								Email of user to share with
							</label>
							<input
								type="text"
								name="email"
								id="email"
								placeholder="email@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="p-2 mt-2 mb-4 border-2 rounded-md shadow-sm border-slate-200 focus:outline-none focus:border-blue-500"
							/>
						</div>
						<button
							type="submit"
							className="w-full px-8 py-4 mb-4 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
						>
							Share
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ShareNote;
