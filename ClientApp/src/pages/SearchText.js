import React, { useState, useEffect } from 'react'
import '../styles/SearchText.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { API_CALL } from '../components/constants'

function SearchText(props) {
	const [texts, setTexts] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		axios
			.get(`${API_CALL}/Text`)
			.then((res) => {
				setTexts(res.data)
			})
			.catch((err) => {})
	}, [])

	const onTextClick = () => {
		navigate('/AddText')
	}

	return (
		<div className='search-text-container'>
			{texts.length ? (
				<>
					{props.isUserLogged && (
						<div className='add-text-input-container'>
							<input className='add-text' type='text' placeholder='Add your own text' onClick={onTextClick} />
						</div>
					)}
					<div className='search-text-header'>
						{texts.map((text) => (
							<Link to={`/Text/${text.id}`} key={text.id}>
								<div className='text-list-element' key={text.id}>
									<div className='text-list-title-container'>
										{text.title}
										<p className='text-page-preview-language'>{text.language}</p>
									</div>
									<p className='text-list-user'>by {text.login}</p>
								</div>
							</Link>
						))}
					</div>
				</>
			) : (
				<div className='loader-container'>
					<div className='lds-dual-ring' />
				</div>
			)}
		</div>
	)
}

export default SearchText
