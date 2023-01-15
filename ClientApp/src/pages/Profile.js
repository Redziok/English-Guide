import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_CALL } from '../components/constants';
import Swal from 'sweetalert2';

const Profile = (props) => {
	const { user } = props;
	let { userLogin } = useParams();
	const [texts, setTexts] = useState([]);
	const [translations, setTranslations] = useState([]);
	const [isTextChosen, setIsTextChosen] = useState(true);

	const toggle = () => setIsTextChosen(!isTextChosen);

	useEffect(() => {
		fetchTexts();
		fetchTranslations();
	}, [user.idUser]);

	const fetchTexts = () => {
		axios
			.get(`${API_CALL}/Text/user=${user.idUser}`)
			.then((res) => {
				setTexts(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchTranslations = () => {
		axios
			.get(`${API_CALL}/Translation/user=${user.idUser}`)
			.then((res) => {
				setTranslations(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const removeText = (isText, idToRemove) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger',
			},
			buttonsStyling: false,
		});

		swalWithBootstrapButtons
			.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				cancelButtonText: 'No, cancel!',
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed && isText) {
					axios
						.delete(`${API_CALL}/Text/${idToRemove}`)
						.then((res) => {
							swalWithBootstrapButtons.fire(
								'Deleted!',
								'Your text has been deleted.',
								'success'
							);
							fetchTexts();
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (result.isConfirmed && !isText) {
					axios
						.delete(`${API_CALL}/Translation/${idToRemove}`)
						.then((res) => {
							swalWithBootstrapButtons.fire(
								'Deleted!',
								'Your translation has been deleted.',
								'success'
							);
							fetchTranslations();
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (result.dismiss === Swal.DismissReason.cancel) return;
			});
	};

	return (
		<div className="profile-container">
			{user.login === userLogin ? (
				<>
					<div className="translation-text-button-container">
						<button
							type="button"
							onClick={toggle}
							disabled={isTextChosen}
						>
							Texts
						</button>
						<button
							type="button"
							onClick={toggle}
							disabled={!isTextChosen}
						>
							Translations
						</button>
					</div>
					{isTextChosen ? (
						<>
							{texts.map((text) => (
								<div
									key={text.idText}
									className="profile-text-container"
								>
									<Link
										to={`/Text/${text.idText}`}
										className="profile-text"
									>
										<div className="profile-text-preview-title-lang">
											{text.title}
											<p className="profile-text-preview-language">
												{text.textLanguage}
											</p>
										</div>
									</Link>
									<hr />
									<div className="profile-text-preview-text">{text.text}</div>
									<div className="profile-text-options">
										<i
											className="fa fa-trash"
											onClick={() => removeText(true, text.idText)}
										/>
									</div>
								</div>
							))}
						</>
					) : (
						<>
							{translations.map((translation) => (
								<div
									key={translation.idTranslation}
									className="profile-text-container"
								>
									<Link
										to={`/Text/${translation.idText}`}
										className="profile-text"
									>
										<div className="profile-text-preview-title-lang">
											{translation.idText}
											<p className="profile-text-preview-language">
												{translation.translationLanguage}
											</p>
										</div>
									</Link>
									<hr />
									<div className="profile-text-preview-text">
										{translation.translatedText}
									</div>
									<div className="profile-text-options">
										<i
											className="fa fa-trash"
											onClick={() =>
												removeText(false, translation.idTranslation)
											}
										/>
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
	);
};

export default Profile;

//<div className="profile-translation-container"> TRANSLATIONS</div>
