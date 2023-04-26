import React, { useState } from "react";
import {
	browserSessionPersistence,
	browserLocalPersistence,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/login/signIn";
import { setPersistence } from "firebase/auth";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const navigate = useNavigate();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		document.getElementById("user-not-found")!.style.display = "none";
		document.getElementById("invalid-password")!.style.display = "none";
		document.getElementById("invalid-email")!.style.display = "none";
		document.getElementById("error-signing-in")!.style.display = "none";

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const data = await signIn(userCredential.user.email!, password);
			const userEmail = userCredential.user.email;

			if (data !== null) {
				navigate("/user", { state: { userEmail } });
			} else {
				alert("Error signing in");
			}

			if (rememberMe) {
				setPersistence(auth, browserLocalPersistence);
			} else {
				setPersistence(auth, browserSessionPersistence);
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === "auth/user-not-found") {
					document.getElementById("user-not-found")!.style.display = "block";
				} else if (error.code === "auth/wrong-password") {
					document.getElementById("invalid-password")!.style.display = "block";
				} else if (error.code === "auth/invalid-email") {
					document.getElementById("invalid-email")!.style.display = "block";
				} else if (password === "") {
					document.getElementById("invalid-password")!.style.display = "block";
				} else {
					document.getElementById("error-signing-in")!.style.display = "block";
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
				<div className="w-1/3 h-auto p-8 bg-white rounded-md shadow-lg">
					<h1 className="pb-3 text-3xl text-slate-700">Sign in</h1>
					<p
						id="user-not-found"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						User not found!
					</p>
					<p
						id="invalid-password"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Invalid password!
					</p>
					<p
						id="invalid-email"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Invalid email!
					</p>
					<p
						id="error-signing-in"
						style={{ display: "none" }}
						className="text-2xl text-red-500"
					>
						Error signing in!
					</p>
					<form onSubmit={handleSignIn}>
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
							<div className="flex items-center gap-2 pb-4">
								<label
									htmlFor="remember-me"
									className="text-1xl text-slate-700"
								>
									Remember me
								</label>
								<input
									type="checkbox"
									name="remember-me"
									id="remember-me"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
								/>
							</div>
						</div>
						<button
							type="submit"
							className="w-full px-8 py-4 mb-4 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
						>
							Sign in!
						</button>
					</form>
					<p className="text-1xl text-slate-700">
						New? Sign up{" "}
						<a href="/sign-up" className="text-blue-500 hover:text-blue-400">
							here
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
