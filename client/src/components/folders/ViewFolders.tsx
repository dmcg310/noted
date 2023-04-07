import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAllFolders from "../../api/folders/fetchAllFolders";

interface Folder {
	_id: string;
	name: string;
	user: string;
	created: string;
	notes: string[];
}

const ViewFolders = () => {
	const [folders, setFolders] = useState<Folder[]>([]);

	const navigate = useNavigate();
	const location = useLocation();

	const userEmail =
		location.state?.userEmail ?? new URLSearchParams(location.search).get("email");

	const goBack = () => {
		navigate(-1);
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchAllFolders(userEmail);
			setFolders(data);
		};

		fetchData();

		if (!userEmail) {
			navigate("/sign-in");
		}
	}, []);

	return (
		<div>
			<h1>Folders</h1>
			<ul>
				{folders.map((folder) => (
					<li key={folder._id}>
						<button
							name="folder-name"
							id="folder-name"
							// onClick={() =>
							// 	navigate(`/user/folders/${folder.name}`, {
							// 		state: { folderName: folder.name },
							// 	})
							// }
						>
							{folder.name}
						</button>
					</li>
				))}
			</ul>
			<button
				name="create-folder"
				id="create-folder"
				onClick={() => navigate(`/user/folders/create?userEmail=${userEmail}`)}
			>
				Create Folder
			</button>
			<p>
				Click <button onClick={goBack}>here</button> to go back
			</p>
		</div>
	);
};

export default ViewFolders;
