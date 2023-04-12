import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./stylesheets/App.css";
import Index from "./components/Index";
import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SingUp";
import User from "./components/user/User";
import SpecficNote from "./components/notes/SpecificNote";
import CreateNote from "./components/notes/CreateNote";
import EditNote from "./components/notes/EditNote";
import ViewFolders from "./components/folders/ViewFolders";
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

                    <Route path="/user/folders" element={<ViewFolders />} />
                    <Route path="/user/folders/create" element={<CreateFolder />} />

                    <Route path="/user/notes/create" element={<CreateNote />} />
                    <Route path="/user/notes/:noteTitle" element={<SpecficNote />} />
                    <Route path="/user/notes/:notetitle/edit" element={<EditNote />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
