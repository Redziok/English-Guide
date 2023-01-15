import React, { Component } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/TextPage.css';
import Select from 'react-select';
import { customStyles, API_CALL } from '../components/constants';
import Swal from 'sweetalert2';

function withParams(Component) {
	return function (props) {
		return (
			<Component
				{...props}
				params={useParams()}
			/>
		);
	};
}

class TextPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			textPage: [],
			text: '',
			language: null,
			translation: [],
			translationElements: [],
			languagesArray: [
				{ value: 'Polish', label: 'Polish' },
				{ value: 'English', label: 'English' },
				{ value: 'German', label: 'German' },
				{ value: 'Russian', label: 'Russian' },
				{ value: 'Spanish', label: 'Spanish' },
			],
			user: [],
			loginUser: '',
			isFormActive: false,
			textPageRatings: [],
			translationRating: 0,
			userRatings: [],
			userTranslationRating: [],
		};
	}

	componentDidMount() {
		this.fetchTranslation();
		this.fetchUser();
		this.fetchRatings();

		axios
			.get(`${API_CALL}/Text/${this.props.params.textId}`)
			.then((res) => {
				this.setState({ textPage: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevState.translation.length !== this.state.translation.length ||
			this.state.languagesArray.length !== 4
		) {
			this.fetchTranslation();
		}
		console.log(prevProps.user);
		if (
			prevProps.user !== this.props.user ||
			prevState.textPageRatings != this.state.textPageRatings
		) {
			axios
				.get(
					`${API_CALL}/Rating/text=${this.props.params.textId}/user=${this.props.user.idUser}`
				)
				.then((res) => {
					this.setState({ userRatings: res.data });
				})
				.catch((err) => {
					console.log(err);
				});
		}
		if (prevState.userTranslationRating != this.state.userTranslationRating) {
			this.fetchRatings();
		}

		if (this.state.translationRating == null) {
			this.setState({ translationRating: 0 });
		}
	}

	fetchRatings = () => {
		axios
			.get(`${API_CALL}/Rating/text=${this.props.params.textId}`)
			.then((res) => {
				this.setState({ textPageRatings: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	fetchTranslation = () => {
		axios
			.get(`${API_CALL}/Translation/text=${this.props.params.textId}`)
			.then((res) => {
				this.setState({
					translation: res.data,
					languagesArray: this.state.languagesArray.filter(
						(item) =>
							item.value !==
							document.getElementsByClassName('text-page-preview-language')[0]
								.innerHTML
					),
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	fetchUser = async () => {
		const response = await fetch(`${API_CALL}/User/user`, {
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		const content = await response.json();
		this.setState({ user: content });
	};

	changeHandler = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleIsFormActive = () =>
		this.setState({ isFormActive: !this.state.isFormActive });

	languageHandler = (language) => {
		this.setState({
			language,
			translationElements: this.state.translation.find(
				(e) => e.translationLanguage === language.value
			),
			translationRating: this.state.textPageRatings.find(
				(e) => e.translationLanguage === language.value
			)?.ratingValue,
			userTranslationRating: this.state.userRatings.find(
				(e) => e.translationLanguage === language.value
			),
			isFormActive: false,
		});
	};

	handleLike = (value) => {
		if (!this.props.isUserLogged) {
			Swal.fire({
				toast: true,
				position: 'top-end',
				icon: 'error',
				title: 'Must be logged to rate translations',
				showConfirmButton: false,
				timer: 1500,
			});
			return;
		}
		const like = document.querySelector('.fa-thumbs-up');
		const dislike = document.querySelector('.fa-thumbs-down');
		if (value === 1) {
			!like.classList.contains('reaction-input-chosen') &&
				like.classList.add('reaction-input-chosen');
			dislike.classList.remove('reaction-input-chosen');
		}
		if (value === -1) {
			!dislike.classList.contains('reaction-input-chosen') &&
				dislike.classList.add('reaction-input-chosen');
			like.classList.remove('reaction-input-chosen');
		} else {
			dislike.classList.remove('reaction-input-chosen');
			like.classList.remove('reaction-input-chosen');
		}

		const formDataLike = new FormData();
		formDataLike.append('ratingValue', value);
		formDataLike.append(
			'idTranslation',
			this.state.translationElements.idTranslation
		);
		formDataLike.append('idText', this.props.params.textId);
		formDataLike.append('idUser', this.props.user.idUser);

		axios
			.post(`${API_CALL}/Rating`, formDataLike)
			.then((res) => {
				this.setState({ userTranslationRating: res.data });
				this.setState({
					translationRating:
						this.state.userTranslationRating == undefined
							? this.state.translationRating + value
							: this.state.translationRating + 2 * value,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	submitHandler = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('translatedText', this.state.text);
		formData.append('translationLanguage', this.state.language.value);
		formData.append('idText', this.props.params.textId);
		formData.append('idUser', this.props.user.idUser);
		axios
			.post(`${API_CALL}/Translation`, formData)
			.then((res) => {
				res.data.login = this.props.user.login;
				this.setState({
					isFormActive: false,
					translationElements: res.data,
				});
				this.fetchTranslation();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<div className="text-page-container">
				<div className="text-page-preview">
					<p className="text-page-preview-user">
						Posted by : <em>{this.state.textPage.login}</em>
					</p>
					<div className="text-page-preview-title">
						Title: {this.state.textPage.title}
					</div>
					<p className="text-page-preview-language">
						{this.state.textPage.textLanguage}
					</p>
					<hr />
					<div className="text-page-preview-text">
						{this.state.textPage.text}
					</div>
				</div>
				<div className="text-page-translation">
					<form onSubmit={this.submitHandler}>
						<Select
							styles={customStyles}
							className="language-choose-container-add-translation"
							value={this.state.language}
							onChange={this.languageHandler}
							options={this.state.languagesArray}
							placeholder="Choose language"
							defaultValue={this.state.languagesArray[0]}
						/>
						{this.state.isFormActive ? (
							<div
								className="text-submit-container"
								id="text-submit-container-id"
							>
								<textarea
									type="text"
									className="text-translation"
									name="text"
									value={this.state.text}
									onChange={this.changeHandler}
								/>
								<div className="options-container-translation">
									<button
										className="submit"
										type="submit"
									>
										{' '}
										Submit{' '}
									</button>
								</div>
							</div>
						) : (
							<div
								className="text-empty-container"
								id="text-empty-container-id"
								style={
									this.state.translationElements !== undefined
										? { display: 'none' }
										: { display: 'block' }
								}
							>
								{this.props.isUserLogged ? (
									<>
										<h3>Add your own translation</h3>
										<button
											type="button"
											onClick={this.handleIsFormActive}
										>
											ADD TRANSLATION
										</button>
									</>
								) : (
									<>
										<h3>Must be logged to add translation</h3>
										<button
											type="button"
											onClick={this.handleIsFormActive}
											disabled
										>
											ADD TRANSLATION
										</button>
									</>
								)}
							</div>
						)}
					</form>
					{this.state.translationElements !== undefined && (
						<div
							className="translation-text-preview"
							style={
								this.state.language === null
									? { display: 'none' }
									: { display: 'block' }
							}
						>
							{
								<p className="text-page-preview-user">
									Posted by : <em>{this.state.translationElements?.login}</em>
								</p>
							}
							<div className="translation-page-preview-text">
								{this.state.translationElements?.translatedText}
							</div>
							<div className="translation-reaction-container">
								<i
									className={
										this.state.userTranslationRating?.ratingValue === 1
											? 'fa fa-thumbs-up reaction-input-chosen'
											: 'fa fa-thumbs-up reaction-input'
									}
									onClick={() => this.handleLike(1)}
								/>
								<p className="like-count-container">
									{this.state.translationRating > 0
										? `+${this.state.translationRating}`
										: this.state.translationRating}
								</p>
								<i
									className={
										this.state.userTranslationRating?.ratingValue === -1
											? 'fa fa-thumbs-down fa-flip-horizontal reaction-input-chosen'
											: 'fa fa-thumbs-down fa-flip-horizontal reaction-input'
									}
									onClick={() => this.handleLike(-1)}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
export default withParams(TextPage);
