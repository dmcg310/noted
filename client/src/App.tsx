import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./stylesheets/App.css";
import Index from "./components/Index";
import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SingUp";
import User from "./components/user/User";
import CreateNote from "./components/notes/CreateNote";
import EditNote from "./components/notes/EditNote";
import CreateFolder from "./components/folders/CreateFolder";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Index />} />

					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />

					<Route path="/user" element={<User />} />

					<Route path="/user/folders/create" element={<CreateFolder />} />
					<Route path="/user/notes/create" element={<CreateNote />} />

					<Route path="/user/notes/:noteId" element={<EditNote />} />
					<Route path="/user/notes/:noteId/edit" element={<EditNote />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
