import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import AddText from './pages/AddText';
import About from './pages/About';
import SearchText from './pages/SearchText';
import TextPage from './pages/TextPage';
import NavMenu from './components/NavMenu';
import LoginForm from './pages/LoginForm';
import { API_CALL } from './components/constants';
import Profile from './pages/Profile';
import axios from 'axios';

const App = () => {
	const [user, setUser] = useState([]);
	const [isUserLogged, setIsUserLogged] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			await axios
				.get(`${API_CALL}/User/user`, {
					withCredentials: true,
				})
				.then((res) => {
					setIsUserLogged(true);
					setUser(res.data);
				})
				.catch((err) => {});
		};
		fetchUser();
	}, [isUserLogged]);

	const loggedIn = () => {
		setIsUserLogged(true);
	};

	const loggedOut = () => {
		setIsUserLogged(false);
	};

	return (
		<React.Fragment>
			<NavMenu isUserLogged={isUserLogged} user={user} loggedOut={loggedOut} />
			<Routes>
				<Route path="About" element={<About />} />
				<Route path="Login" element={<LoginForm loggedIn={loggedIn} />} />
				<Route path="/" element={<SearchText isUserLogged={isUserLogged} />} />
				<Route path="Text/:textId" element={<TextPage isUserLogged={isUserLogged} user={user} />} />
				<Route path="/:userLogin" element={<Profile user={user} />} />
				<Route
					path="*"
					element={
						<main style={{ padding: '1rem' }}>
							<p>There's nothing here!</p>
						</main>
					}
				/>
				<Route path="AddText" element={<AddText />} />
			</Routes>
		</React.Fragment>
	);
};

export default App;
