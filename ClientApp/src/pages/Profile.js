import React, { useState, useEffect } from 'react'
import '../styles/Profile.css'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_CALL, createToast } from '../components/constants'
import Swal from 'sweetalert2'

const Profile = (props) => {
	const { user } = props
	const { userLogin } = useParams()
	const [texts, setTexts] = useState([])
	const [translations, setTranslations] = useState([])
	const [isTextChosen, setIsTextChosen] = useState(true)

	const toggle = () => setIsTextChosen(!isTextChosen)

	useEffect(() => {
		fetchTexts()
		fetchTranslations()
	}, [user.id])

	const fetchTexts = () => {
		axios.get(`${API_CALL}/Text/user=${user.id}`).then((res) => {
			setTexts(res.data)
		})
	}

	const fetchTranslations = () => {
		axios.get(`${API_CALL}/Translation/user=${user.id}`).then((res) => {
			setTranslations(res.data)
		})
	}

	const removeById = (textType, id) => {
		createToast
			.fire({
				showConfirmButton: true,
				customClass: {
					confirmButton: 'btn btn-success',
					cancelButton: 'btn btn-danger',
				},
				buttonsStyling: false,
				text: `Are you sure you want to delete the ${textType.toLowerCase()} ?`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				cancelButtonText: 'No, cancel!',
				reverseButtons: true,
				position: 'center',
				width: '400px',
				timer: 0,
			})
			.then((result) => {
				if (result.isConfirmed) {
					axios.delete(`${API_CALL}/${textType}/${id}`).then((res) => {
						textType === 'Text' ? fetchTexts() : fetchTranslations()
						createToast.fire({
							icon: 'success',
							title: 'Deleted!',
							text: `Your ${textType.toLowerCase()} has been deleted`,
						})
					})
				} else if (result.isDismissed) return
			})
	}

	return (
		<div className='profile-container'>
			{user.login === userLogin ? (
				<>
					<div className='translation-text-button-container'>
						<button type='button' onClick={toggle} disabled={isTextChosen}>
							Texts
						</button>
						<button type='button' onClick={toggle} disabled={!isTextChosen}>
							Translations
						</button>
					</div>
					{isTextChosen ? (
						<>
							{texts.map((text) => (
								<div key={text.id} className='profile-text-container'>
									<Link to={`/Text/${text.id}`} className='profile-text'>
										<div className='profile-text-preview-title-lang'>
											{text.title}
											<p className='text-page-preview-language'>{text.language}</p>
										</div>
									</Link>
									<hr />
									<div className='profile-text-preview-text'>{text.text}</div>
									<div className='profile-text-options'>
										<i className='fa fa-trash' onClick={() => removeById('Text', text.id)} />
									</div>
								</div>
							))}
						</>
					) : (
						<>
							{translations.map((translation) => (
								<div key={translation.id} className='profile-text-container'>
									<Link to={`/Text/${translation.idText}`} className='profile-text'>
										<div className='profile-text-preview-title-lang'>
											{translation.title}
											<p className='text-page-preview-language'>{translation.textLanguage}</p>
										</div>
									</Link>
									<hr />
									<div className='text-page-preview-language translation'>{translation.language}</div>
									<div className='profile-text-preview-text'>{translation.translatedText}</div>
									<div className='profile-text-options'>
										<i className='fa fa-trash' onClick={() => removeById('Translation', translation.id)} />
									</div>
								</div>
							))}
						</>
					)}
				</>
			) : (
				<>
					<h1>You're not authenticated</h1>
				</>
			)}
		</div>
	)
}

export default Profile
