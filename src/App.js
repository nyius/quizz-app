import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AllQuizes from './pages/AllQuizes';
import MyProfile from './pages/MyProfile';
import CreateQuiz from './pages/CreateQuiz';
import CreateAccount from './pages/CreateAccount';
import Quiz from './pages/Quiz';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoutes from './components/PrivateRoutes';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<Router>
			<div className="flex flex-col relative h-screen bg-base-100 mainApp">
				<Navbar />
				<div className="flex flex-col mx-auto h-screen w-11/12 max-w-screen-2xl justify-center items-center">
					<Routes>
						<Route path="/" element={<AllQuizes />} />
						<Route exact path="/sign-in" element={<Login />} />
						<Route exact path="/quiz/:quizId" element={<Quiz />} />
						<Route exact path="/profile/:userId" element={<UserProfile />} />
						<Route exact path="/create-account" element={<CreateAccount />} />
						<Route
							exact
							path="/my-profile"
							element={
								<PrivateRoutes>
									<MyProfile />
								</PrivateRoutes>
							}
						/>
						<Route
							exact
							path="/create-quiz"
							element={
								<PrivateRoutes>
									<CreateQuiz />
								</PrivateRoutes>
							}
						/>
					</Routes>
				</div>
				<ToastContainer />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
