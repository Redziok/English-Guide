import React, { useState, useEffect } from 'react';
import '../styles/SearchText.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_CALL } from '../components/constants';

function SearchText(props) {
	const [texts, setTexts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`${API_CALL}/Text`)
			.then((res) => {
				setTexts(res.data);
			})
			.catch((err) => {});
	}, []);

	const onTextClick = () => {
		navigate('/AddText');
	};

	return (
		<div className="search-text-container">
			{props.isUserLogged && (
				<div className="add-text-input-container">
					<input className="add-text" type="text" placeholder="Add your own text" onClick={onTextClick} />
				</div>
			)}
			<div className="search-text-header">
				{texts.map((text) => (
					<Link to={`/Text/${text.idText}`} key={text.idText}>
						<div className="text-list-element" key={text.idText}>
							{text.title}
							<p className="text-list-language">{text.textLanguage}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export default SearchText;
