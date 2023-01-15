import React, { Component } from 'react';
import '../styles/AddText.css';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { customStyles, API_CALL } from '../components/constants';

export const languages = [
	{ value: 'Polish', label: 'Polish' },
	{ value: 'English', label: 'English' },
	{ value: 'German', label: 'German' },
	{ value: 'Russian', label: 'Russian' },
	{ value: 'Spanish', label: 'Spanish' },
];

function withParams(Component) {
	return function (props) {
		return (
			<Component
				{...props}
				params={useNavigate()}
			/>
		);
	};
}

class AddText extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			text: '',
			language: null,
			idUser: null,
		};
	}

	componentDidMount() {
		const fetchTexts = async () => {
			const response = await fetch(`${API_CALL}/User/user`, {
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});

			const content = await response.json();
			this.setState({ idUser: content.idUser });
		};

		fetchTexts();
	}

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	languageHandler = (language) => {
		this.setState({ language });
	};

	submitHandler = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('title', this.state.title);
		formData.append('text', this.state.text);
		formData.append('idUser', this.state.idUser);
		formData.append('textLanguage', this.state.language.value);
		axios
			.post(`${API_CALL}/Text`, formData)
			.then((res) => {
				this.props.params(`/Text/${res.data.idText}`);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const { title, text, language } = this.state;
		return (
			<div className="add-text-container">
				<form
					id="add-text-form"
					onSubmit={this.submitHandler}
				>
					<div className="add-text-inputs">
						<div className="title-container">
							<input
								type="text"
								className="title"
								placeholder="Title"
								name="title"
								value={title}
								onChange={this.changeHandler}
							/>
						</div>
						<div className="text-container">
							<textarea
								type="text"
								placeholder="Text"
								className="text"
								name="text"
								value={text}
								onChange={this.changeHandler}
							/>
						</div>
						<Select
							styles={customStyles}
							className="language-choose-container-add-text"
							value={language}
							onChange={this.languageHandler}
							options={languages}
							defaultValue={languages[0]}
							placeholder="Select text language"
						/>
						<hr />
						<div className="button-container">
							<button
								className="submit"
								type="submit"
							>
								{' '}
								Add Text{' '}
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withParams(AddText);
