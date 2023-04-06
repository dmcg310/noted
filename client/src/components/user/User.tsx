import { useLocation, useNavigate } from "react-router-dom";
import SignOut from "../login/SignOut";

const User = () => {
	const navigate = useNavigate();

	const location = useLocation();
	const userEmail = location.state?.userEmail;

	const viewNotes = () => {
		navigate("/user/notes", { state: { userEmail } });
	};

	return (
		<div>
			<h1>Welcome, {userEmail}</h1>
			<button name="view-notes" id="view-notes" onClick={viewNotes}>
				View Notes
			</button>
			<SignOut />
		</div>
	);
};

export default User;
