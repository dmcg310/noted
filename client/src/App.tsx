import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Notes from "./components/Notes";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/notes/:noteId" element={<Notes />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
