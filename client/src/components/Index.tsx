import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";

const Index = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setIsLoading(false);
			if (user) {
				navigate("/user", { state: { userEmail: user.email } });
			}
		});
		return unsubscribe;
	}, [navigate]);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<div>
			<h1>noted.</h1>

			<button name="sign-up-route" onClick={() => navigate("/sign-up")}>
				Sign Up
			</button>
			<button name="sign-in-route" onClick={() => navigate("/sign-in")}>
				Sign In
			</button>
		</div>
	);
};

export default Index;
