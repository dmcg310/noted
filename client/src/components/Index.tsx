import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import createNoteImage from "../../../client/src/assets/Create-Note.png";

const Index = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setIsLoading(false);

			if (user) {
				navigate("/user", { state: { userEmail: user.email } });
			}
		});
		return unsubscribe;
	}, [navigate]);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

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
			<div className="flex justify-center min-h-screen align-middle bg-slate-200 ">
				<div className="w-1/2 mt-20 bg-white rounded-md shadow-xl h-max p-7">
					<h1 className="pb-3 text-6xl text-center text-slate-600">noted.</h1>
					<h3 className="pb-3 text-3xl text-center text-slate-600">
						Welcome to noted!
						<hr className="w-1/2 mx-auto mt-3 mb-3 border-2 border-slate-200" />
					</h3>
					<div className="flex">
						<div className="w-1/2 pb-3 text-2xl text-slate-600">
							<p className="pr-2 text-2xl text-center pb-7 text-slate-600">
								With our intuitive and user-friendly interface, you'll be
								able to take and organize notes like a{" "}
								<span className="underline text-emerald-500">
									pro in no time.
								</span>
							</p>
							<p className="pr-2 text-2xl text-center pb-7 text-slate-600">
								Our app offers a variety of features, including the
								ability to{" "}
								<span className="underline text-emerald-500">
									create multiple folders, add notes to folders,
								</span>{" "}
								<span className="underline text-emerald-500">
									spellcheck,
								</span>{" "}
								and even a handy{" "}
								<span className="underline text-emerald-500">
									todo list.
								</span>
							</p>
							<p className="pr-2 text-2xl text-center pb-7 text-slate-600">
								Plus, with our{" "}
								<span className="underline text-emerald-500">
									cloud-based storage,
								</span>{" "}
								you can access your notes from anywhere. But we don't just
								stop at note-taking. Our app also offers a range of{" "}
								<span className="underline text-emerald-500">
									customization options,
								</span>{" "}
								so you can personalize your experience to fit your unique
								needs. as versatile as you are. <br />
								So why wait? Sign up today and start taking notes!
							</p>
						</div>

						<div className="w-2/3">
							<img
								className="float-right mb-5 ml-5 border rounded-md shadow-xl border-slate-200"
								src={createNoteImage}
								alt="create-note"
								width={800}
								height={800}
								style={{ objectFit: "cover" }}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-4">
						<button
							name="sign-up-route"
							onClick={() => navigate("/sign-up")}
							className="w-2/5 px-8 py-4 mt-2 text-2xl text-white transition duration-100 ease-in bg-blue-400 rounded-md shadow-lg hover:bg-blue-300 text"
						>
							Sign Up
						</button>

						<button
							name="sign-in-route"
							onClick={() => navigate("/sign-in")}
							className="w-3/5 px-8 py-4 mt-2 text-2xl text-white transition duration-100 ease-in rounded-md shadow-lg bg-rose-500 hover:bg-rose-400"
						>
							Sign In
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
