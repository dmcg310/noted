import { auth } from "../../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
