import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../api/login/signUp";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		document.getElementById("email-in-use")!.style.display = "none";
		document.getElementById("invalid-email")!.style.display = "none";
		document.getElementById("weak-password")!.style.display = "none";
		document.getElementById("network-error")!.style.display = "none";
		document.getElementById("account-exists")!.style.display = "none";

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await signUp(userCredential.user.email!, password);

			navigate("/");
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === "auth/email-already-in-use") {
					document.getElementById("email-in-use")!.style.display = "block";
				} else if (error.code === "auth/invalid-email") {
					document.getElementById("invalid-email")!.style.display = "block";
				} else if (error.code === "auth/weak-password") {
					document.getElementById("weak-password")!.style.display = "block";
				} else if (error.code === "auth/network-request-failed") {
					document.getElementById("network-error")!.style.display = "block";
				} else if (
					error.code === "auth/account-exists-with-different-credential"
				) {
					document.getElementById("account-exists")!.style.display = "block";
				} else if (error.code === "auth/credential-already-in-use") {
					alert("Credential already in use!");
				} else if (password.length < 6) {
					document.getElementById("weak-password")!.style.display = "block";
				} else if (email === "") {
					document.getElementById("invalid-email")!.style.display = "block";
				} else {
					document.getElementById("network-error")!.style.display = "block";
				}
			}
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
					<h1 className="pb-3 text-3xl text-slate-700">Sign up</h1>
					<p
						id="email-in-use"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Email already in use!
					</p>
					<p
						id="invalid-email"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Invalid email!
					</p>
					<p
						id="weak-password"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Password should be at least 6 characters!
					</p>
					<p
						id="network-error"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Network error!
					</p>
					<p
						id="account-exists"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Account already exists with different credentials!
					</p>
					<p
						id="credential-already-in-use"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Credential already in use!
					</p>
					<p
						id="error-signing-up"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Error signing up!
					</p>
					<form onSubmit={handleSignUp}>
						<div className="flex flex-col">
							<label htmlFor="email" className="text-1xl text-slate-700">
								Email
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
							<label htmlFor="password" className="text-1xl text-slate-700">
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 mt-2 mb-4 border-2 rounded-md shadow-sm border-slate-200 focus:outline-none focus:border-blue-500"
							/>
						</div>
						<button
							type="submit"
							className="w-full px-8 py-4 mb-4 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
						>
							Sign up!
						</button>
					</form>
					<p className="text-1xl text-slate-700">
						Already have an account? Sign in{" "}
						<a href="/sign-in" className="text-blue-500 hover:text-blue-400">
							here
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
