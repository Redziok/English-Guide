import React, { Component } from 'react'
import '../styles/AddText.css'
import axios from 'axios'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { customStyles, API_CALL, createToast, languages } from '../components/constants'

function withParams(Component) {
	return function (props) {
		return <Component {...props} params={useNavigate()} />
	}
}

class AddText extends Component {
	constructor(props) {
		super(props)

		this.state = {
			title: '',
			text: '',
			language: null,
			languages: languages,
		}
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	languageHandler = (language) => {
		this.setState({ language })
	}

	postText = () => {
		const formData = new FormData()
		formData.append('title', this.state.title)
		formData.append('text', this.state.text)
		formData.append('idUser', this.props.user?.id)
		formData.append('language', this.state.language?.value)
		axios.post(`${API_CALL}/Text`, formData).then((res) => {
			this.props.params(`/Text/${res.data.id}`)
		})
	}

	submitHandler = (e) => {
		e.preventDefault()
		if (!this.state.language?.value) {
			createToast.fire({
				icon: 'error',
				text: 'Language not chosen',
			})
			return
		}
		let textAreas = this.state.text.split(/\r?\n\r?\n/)
		if (textAreas.length !== 1) {
			this.postText()
		} else {
			createToast
				.fire({
					showConfirmButton: true,
					customClass: {
						confirmButton: 'btn btn-success',
						cancelButton: 'btn btn-danger',
					},
					buttonsStyling: false,
					title: 'Your text contains only one section!',
					text: 'To fix it go back and add spaces between paragraphs',
					icon: 'question',
					showCancelButton: true,
					confirmButtonText: 'Add it anyway',
					cancelButtonText: 'Let me fix it',
					reverseButtons: true,
					position: 'center',
					width: '400px',
					timer: 0,
				})
				.then((result) => {
					if (result.isConfirmed) this.postText()
					else if (result.isDismissed) return
				})
		}
	}

	render() {
		const { title, text, language } = this.state
		return (
			<div className='add-text-container'>
				<form id='add-text-form' onSubmit={this.submitHandler}>
					<div className='add-text-inputs'>
						<div className='title-container'>
							<input type='text' className='title' placeholder='Title' name='title' value={title} onChange={this.changeHandler} required />
						</div>
						<div className='text-container'>
							<textarea type='text' placeholder='Text' className='text' name='text' value={text} onChange={this.changeHandler} required />
						</div>
						<p className='text-alert'>Leave a space between paragraph to split the text into sections and make it easier to translate! </p>
						<Select
							styles={customStyles}
							className='language-choose-container-add-text'
							value={language}
							onChange={this.languageHandler}
							options={languages}
							placeholder='Select text language'
						/>
						<hr />
						<div className='button-container'>
							<button className='submit' type='submit'>
								Add Text
							</button>
						</div>
					</div>
				</form>
			</div>
		)
	}
}

export default withParams(AddText)
