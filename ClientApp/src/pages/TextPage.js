import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/TextPage.css'
import Select from 'react-select'
import { customStyles, API_CALL, languages, createToast } from '../components/constants'
import TranslationPopup from './TranslationPopup'
import { useParams } from 'react-router-dom'

const TextPage = ({ user, isUserLogged }) => {
	const { textId } = useParams()
	const [textPageData, setTextPageData] = useState({
		textPage: {},
		languagesArray: [],
		textPageSplitText: [],
	})
	const [translationsData, setTranslationsData] = useState({
		translations: {},
		chosenTranslation: [],
	})
	const [chosenLanguage, setChosenLanguage] = useState([])
	const [isPopupVisible, setIsPopupVisible] = useState(false)
	const [popupPosition, setPopupPosition] = useState(0)
	const [sectionId, setSectionId] = useState(null)

	useEffect(() => {
		const fetchTexts = async () => {
			await axios.get(`${API_CALL}/Text/${textId}`).then((res) => {
				setTextPageData({
					textPage: res.data,
					languagesArray: languages.filter((item) => item.value !== res.data.language),
					textPageSplitText: res.data.text.split(/\r?\n\r?\n/),
				})
			})
		}
		fetchTexts()
	}, [])

	useEffect(() => {
		const fetchTranslations = async () => {
			await axios.get(`${API_CALL}/Translation/text=${textId}/language=${chosenLanguage?.value}`).then((res) => {
				setTranslationsData({
					translations: res.data,
				})
				addTranslations(res.data)
			})
		}
		fetchTranslations()
	}, [chosenLanguage?.value])

	const addTranslations = (data) => {
		for (const div of document.querySelectorAll('.has-translation')) {
			if (div) div.className = 'text-containers empty'
		}
		data.map((translation) => {
			const element = document.querySelector(`#text-container-section-${translation.sectionId}`)
			if (element) {
				editTextContainer('translated', translation.sectionId)
			}
		})
	}

	const languageHandler = (language) => {
		setChosenLanguage(language)
	}

	const editTextContainer = (action, section) => {
		switch (action) {
			case 'empty':
				document.querySelector(`#text-container-section-${section}`).className = 'text-containers empty'
				break
			case 'translating':
				document.querySelector(`#text-container-section-${section}`).classList.add('is-translating')
				break
			case 'translated':
				document.querySelector(`#text-container-section-${section}`).className = 'text-containers has-translation'
		}
	}

	const handleTranslation = (event) => {
		const target = event.target
		const section = target.getAttribute('section-key')
		const translating = document.querySelector('.is-translating')
		if (translating) translating.classList.remove('is-translating')
		if (!target.classList.contains('text-containers')) {
			setIsPopupVisible(false)
			return
		}
		if (!chosenLanguage?.value) {
			createToast.fire({
				icon: 'error',
				text: 'Language not chosen',
			})
			return
		}
		setSectionId(section)
		setIsPopupVisible(true)
		editTextContainer('translating', section)
		section === (textPageData?.textPageSplitText?.length - 1).toString() && parseInt(section) > 3
			? setPopupPosition(target.offsetTop - 300)
			: setPopupPosition(target.offsetTop - 100)
	}

	return (
		<div className='text-page-container'>
			<div className='text-page-preview' onClick={handleTranslation}>
				<div className='text-page-header'>
					<div className='text-page-header-info'>
						<p className='text-page-preview-user'>
							Posted by : <em>{textPageData?.textPage?.login}</em>
						</p>
						<div className='text-page-preview-title'>Title: {textPageData?.textPage?.title}</div>
						<p className='text-page-preview-language'>{textPageData?.textPage?.language}</p>
					</div>
					<div>
						<Select
							styles={customStyles}
							className='language-choose-container-add-translation'
							value={chosenLanguage}
							onChange={languageHandler}
							options={textPageData?.languagesArray}
							placeholder='Choose language'
						/>
					</div>
				</div>
				<hr />
				{textPageData?.textPageSplitText?.length ? (
					<div className='text-page-preview-text'>
						{textPageData?.textPageSplitText.map((section, idx) => (
							<p id={`text-container-section-${idx}`} className='text-containers empty' key={idx} section-key={idx}>
								{section}
							</p>
						))}
					</div>
				) : (
					<div className='loader-container'>
						<div className='lds-dual-ring' />
					</div>
				)}
			</div>
			{isPopupVisible && (
				<TranslationPopup
					user={user}
					isUserLogged={isUserLogged}
					textOwner={textPageData?.textPage?.idUser}
					chosenLanguage={chosenLanguage}
					popupPosition={popupPosition}
					sectionId={sectionId}
					translationsData={translationsData}
					setTranslationsData={setTranslationsData}
				/>
			)}
		</div>
	)
}

export default TextPage
