import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createFolder from "../../api/folders/createFolder";
import User from "../user/User";

const CreateFolder = () => {
	const [name, setFolderName] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	const email = location.state.userEmail;

	const handleSubmit = async () => {
		if (name === "") {
			alert("Folder name cannot be empty");
			return;
		}

		const folder = await createFolder({
			email,
			name,
		});

		if (folder) {
			navigate(-1);
		} else {
			alert("Error creating folder");
		}
	};

	return (
		<div>
			<div
				id="user-header"
				className="w-screen flex justify-between p-2.5 pl-3 fixed bg-white"
				style={{ alignItems: "center" }}
			>
				<button
					className="px-4 py-2 text-3xl transition duration-100 ease-in rounded-md shadow-md text-slate-600 bg-slate-100 hover:bg-slate-200 text"
					onClick={() => navigate("/")}
				>
					noted.
				</button>
			</div>
			<div className="flex items-center justify-center h-screen bg-slate-200">
				<div className="w-1/3 h-auto p-8 bg-white rounded-md shadow-lg">
					<h1 className="pb-3 text-3xl text-slate-700">Create Folder</h1>
					<form method="POST">
						<div className="flex flex-col">
							<label
								htmlFor="folderName"
								className="text-1xl text-slate-700"
							>
								Folder Name
							</label>
							<input
								type="text"
								name="folderName"
								id="folderName"
								value={name}
								onChange={(e) => setFolderName(e.target.value)}
								className="p-2 mt-2 mb-4 border-2 rounded-md shadow-sm border-slate-200 focus:outline-none focus:border-blue-500"
							/>
						</div>
						<button
							type="button"
							onClick={handleSubmit}
							className="w-full px-8 py-4 mb-4 text-2xl transition duration-100 ease-in rounded-md shadow-lg bg-emerald-500 hover:bg-emerald-400 text-slate-100"
						>
							Create Folder
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateFolder;
