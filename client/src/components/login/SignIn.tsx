import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../api/login/signIn";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const data = await signIn(userCredential.user.email!, password);
			const userEmail = userCredential.user.email;

			if (data !== null) {
				navigate("/user", { state: { userEmail } });
			} else {
				alert("Error signing in");
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === "auth/user-not-found") {
					alert("User not found");
				} else if (error.code === "auth/wrong-password") {
					alert("Invalid password");
				} else if (error.code === "auth/invalid-email") {
					alert("Invalid email");
				} else {
					alert("Error signing in");
				}
			}
		}
	};

	return (
		<div>
			<h1>Sign In</h1>
			<form onSubmit={handleSignIn}>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<label htmlFor="password">Password</label>
				<input
					type="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button type="submit">Sign In</button>
			</form>
		</div>
	);
};

export default SignIn;
