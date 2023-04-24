import { auth } from "../../../firebase/firebaseConfig";

const SignOut = async () => {
	try {
		await auth.signOut();
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export default SignOut;
