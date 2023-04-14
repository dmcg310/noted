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
					alert("Email already in use, would you like to sign in?");
				} else if (error.code === "auth/invalid-email") {
					alert("Invalid email");
				} else if (error.code === "auth/weak-password") {
					alert("Password should be at least 6 characters");
				} else if (error.code === "auth/network-request-failed") {
					alert("Network error");
				} else if (
					error.code === "auth/account-exists-with-different-credential"
				) {
					alert("Account already exists with different credentials");
				} else if (error.code === "auth/credential-already-in-use") {
					alert("Credential already in use");
				} else {
					alert("Error signing up");
				}
			}
		}
	};

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSignUp}>
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

				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default SignUp;
