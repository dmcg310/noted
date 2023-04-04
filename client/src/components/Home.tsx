import { useNavigate } from "react-router";

const Home = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/notes");
	};

	return (
		<div>
			<button id="view-notes" onClick={handleClick}>
				View Notes
			</button>
		</div>
	);
};

export default Home;
