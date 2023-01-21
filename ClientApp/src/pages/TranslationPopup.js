import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_CALL, createToast } from '../components/constants'
import { useParams } from 'react-router-dom'

const TranslationPopup = ({ user, isUserLogged, textOwner, chosenLanguage, popupPosition, sectionId, translationsData, setTranslationsData }) => {
	const { textId } = useParams()
	const [text, setText] = useState('')
	const [translationRating, settranslationRating] = useState({
		rating: 0,
		chosenTranslationRating: [],
	})
	const [isFormActive, setIsFormActive] = useState(false)
	const [userRatings, setUserRatings] = useState()

	useEffect(() => {
		setTranslationsData((prev) => ({
			translations: translationsData?.translations,
			chosenTranslation: translationsData?.translations.find((e) => e.sectionId.toString() === sectionId.toString()),
		}))
		fetchRating()
		fetchUserRating()
		setIsFormActive(false)
	}, [sectionId])

	const handleIsFormActiveSet = () => setIsFormActive(!isFormActive)
	const handleTextSet = (event) => setText(event.target.value)

	const fetchRating = async () => {
		await axios.get(`${API_CALL}/Rating/text=${textId}/language=${chosenLanguage?.value}/section=${sectionId}`).then((res) => {
			settranslationRating({
				chosenTranslationRating: res.data,
				rating: res.data.rating,
			})
		})
	}

	const fetchUserRating = async () => {
		await axios.get(`${API_CALL}/Rating/text=${textId}/language=${chosenLanguage?.value}/section=${sectionId}/user=${user.id}`).then((res) => {
			setUserRatings(res.data)
		})
	}

	const removeTranslation = (translation) => {
		createToast
			.fire({
				showConfirmButton: true,
				customClass: {
					confirmButton: 'btn btn-success',
					cancelButton: 'btn btn-danger',
				},
				buttonsStyling: false,
				text: 'Are you sure you want to delete the translation?',
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
					axios.delete(`${API_CALL}/Translation/${translation.id}`).then((res) => {
						setTranslationsData((prev) => ({
							translations: prev.translations.filter((item) => item.id.toString() !== translation.id.toString()),
							chosenTranslation: null,
						}))
						document.querySelector(`#text-container-section-${translation.sectionId}`).classList.replace('has-translation', 'empty')
						createToast.fire({
							icon: 'success',
							title: 'Deleted!',
							text: 'Your translation has been deleted',
						})
					})
				} else if (result.isDismissed) return
			})
	}

	const handleLike = (value) => {
		if (!isUserLogged) {
			createToast.fire({
				icon: 'error',
				text: 'Must be logged to rate',
			})
			return
		}
		const like = document.querySelector('#like-button-id')
		const dislike = document.querySelector('#dislike-button-id')
		if (value === 1) {
			like.classList.add('reaction-input-chosen')
			dislike.classList.remove('reaction-input-chosen')
		}
		if (value === -1) {
			dislike.classList.add('reaction-input-chosen')
			like.classList.remove('reaction-input-chosen')
		} else {
			dislike.classList.remove('reaction-input-chosen')
			like.classList.remove('reaction-input-chosen')
		}

		const formDataLike = new FormData()
		formDataLike.append('rating', value)
		formDataLike.append('idTranslation', translationsData?.chosenTranslation?.id)
		formDataLike.append('idText', textId)
		formDataLike.append('idUser', user.id)

		axios.post(`${API_CALL}/Rating`, formDataLike).then((res) => {
			setUserRatings(res.data)
			settranslationRating({
				rating: !userRatings?.rating ? translationRating.rating + value : translationRating.rating + 2 * value,
			})
		})
	}

	const submitHandler = (e) => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('translatedText', text)
		formData.append('language', chosenLanguage?.value)
		formData.append('idText', textId)
		formData.append('idUser', user.id)
		formData.append('sectionId', sectionId)
		axios.post(`${API_CALL}/Translation`, formData).then((res) => {
			res.data.login = user.login
			setTranslationsData((prev) => ({
				translations: [...prev.translations, res.data],
				chosenTranslation: res.data,
			}))
			setIsFormActive(false)
			setText('')
		})
	}

	return (
		<div className='text-page-translation' style={{ top: `${popupPosition}px` }}>
			{translationsData?.chosenTranslation ? (
				<div className='translation-text-preview'>
					<div className='translation-preview-header'>
						<p className='text-page-preview-user'>
							Posted by : <em>{translationsData?.chosenTranslation?.login}</em>
						</p>
					</div>
					<div className='translation-page-preview-text'>{translationsData?.chosenTranslation?.translatedText}</div>
					<div className='translation-reaction-container'>
						<i
							className={userRatings?.rating === 1 ? 'fa fa-thumbs-up reaction-input-chosen' : 'fa fa-thumbs-up reaction-input'}
							id='like-button-id'
							onClick={() => handleLike(1)}
						/>
						<p className='like-count-container'>{translationRating?.rating > 0 ? `+${translationRating?.rating}` : translationRating?.rating}</p>
						<i
							className={
								userRatings?.rating === -1
									? 'fa fa-thumbs-down fa-flip-horizontal reaction-input-chosen'
									: 'fa fa-thumbs-down fa-flip-horizontal reaction-input'
							}
							id='dislike-button-id'
							onClick={() => handleLike(-1)}
						/>
						{(user.id === textOwner || user.isAdmin) && (
							<i
								className='fa fa-trash remove-input'
								title='remove translation'
								onClick={() => removeTranslation(translationsData?.chosenTranslation)}
							/>
						)}
					</div>
				</div>
			) : isFormActive ? (
				<form onSubmit={submitHandler}>
					<textarea className='text-translation' name='text' value={text} onChange={handleTextSet} required />
					<div className='options-container-translation'>
						<button className='submit' type='submit'>
							Submit
						</button>
					</div>
				</form>
			) : (
				<div className='text-empty-container' id='text-empty-container-id'>
					{isUserLogged ? (
						<>
							<h3>Add your own translation</h3>
							<button type='button' onClick={handleIsFormActiveSet}>
								ADD TRANSLATION
							</button>
						</>
					) : (
						<>
							<h3>Must be logged to add translation</h3>
							<button type='button' onClick={handleIsFormActiveSet} disabled>
								ADD TRANSLATION
							</button>
						</>
					)}
				</div>
			)}
		</div>
	)
}

export default TranslationPopup
