import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./stylesheets/App.css";
import Notes from "./components/Notes";
import CreateNote from "./components/CreateNote";
import Index from "./components/Index";
import SignIn from "./components/SignIn";
import SignUp from "./components/SingUp";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/notes/:noteId" element={<Notes />} />
					<Route path="/notes/create" element={<CreateNote />} />
					<Route path="/notes/delete" element={<Notes />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
