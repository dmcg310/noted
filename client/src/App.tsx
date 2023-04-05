import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./stylesheets/App.css";
import Index from "./components/Index";
import SignIn from "./components/SignIn";
import SignUp from "./components/SingUp";
import User from "./components/User";
import UserNotes from "./components/UserNotes";
import SpecficNote from "./components/SpecificNote";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/user" element={<User />} />
					<Route path="/user/notes" element={<UserNotes />} />
					{/* <Route path="/user/notes/create" element={<CreateNote />} /> */}
					{/* <Route path="/user/notes/edit" element={<EditNote />} /> */}
					<Route path="/user/notes/:noteTitle" element={<SpecficNote />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
