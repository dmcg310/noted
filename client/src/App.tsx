import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Notes from "./components/Notes";
import CreateNote from "./components/CreateNote";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
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
