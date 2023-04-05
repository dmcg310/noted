import { useNavigate } from "react-router-dom";

const Index = () => {
	const navigate = useNavigate();

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
