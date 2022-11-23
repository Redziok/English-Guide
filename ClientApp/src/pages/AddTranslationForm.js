import axios from "axios";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
import '../styles/TextPage.css';
import Select from 'react-select';
import { customStyles, API_CALL } from "../components/constants";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

export class AddTranslationForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            language: null,
            translation: [],
            translationElements: [],
            removeTranslation: '',
            languagesArray: [
                { value: 'Polish', label: 'Polish' },
                { value: 'English', label: 'English' },
                { value: 'German', label: 'German' },
                { value: 'Russian', label: 'Russian' },
                { value: 'Spanish', label: 'Spanish' },
            ],
            idUser: 0,
            loginUser: '',
            isFormActive: false
        }
    }

    componentDidMount() {
        this.getTranslation();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.translation.length !== this.state.translation.length || this.state.languagesArray.length !== 4) {
            this.getTranslation();
        }
        if (prevState.idUser === 0) {
            this.getUser();
        }
    }

    getTranslation = () => {
        axios.get(`${API_CALL}/Translation/${this.props.params.textId}`)
            .then(res => {
                this.setState({
                    translation: res.data,
                    languagesArray: this.state.languagesArray.filter(item => item.value !== (document.getElementsByClassName('text-page-preview-language')[0].innerHTML))
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getUser = () => {
        (
            async () => {
                const response = await fetch(`${API_CALL}/User/user`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const content = await response.json();
                this.setState({ idUser: content.idUser });
            }
        )();
    }

    getTranslationOwner = () => {

    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleIsFormActive = () => this.setState({ isFormActive: !this.state.isFormActive });

    languageHandler = (language) => {
        this.setState({
            language,
            translationElements: this.state.translation.find(e => e.translationLanguage === language.value)
        });
    };

    submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('translatedText', this.state.text);
        formData.append('translationLanguage', this.state.language['value']);
        formData.append('idText', this.props.params.textId);
        formData.append('idUser', this.state.idUser);
        axios.post(`${API_CALL}/Translation`, formData)
            .then(res => {
            })
            .catch(err => {
                console.log(err)
            })
        document.getElementById('text-submit-container-id').style.display = 'block';
    }

    onAddText = () => {
        document.getElementById('text-empty-container-id').style.display = 'none';
        document.getElementById('text-submit-container-id').style.display = 'block';
    }

    render() {
        const { text, language } = this.state
        return (
            <div className='text-page-translation'>
                <form onSubmit={this.submitHandler}>
                    <Select
                        styles={customStyles}
                        className="language-choose-container-add-translation"
                        value={language}
                        onChange={this.languageHandler}
                        options={this.state.languagesArray}
                        placeholder='Choose language'
                        defaultValue={this.state.languagesArray[0]}
                    />
                    {this.state.isFormActive ?
                        <div className="text-submit-container" id="text-submit-container-id">
                            <textarea type='text' className='text-translation' name='text' value={text} onChange={this.changeHandler} />
                            <div className="options-container-translation">
                                <button className="submit" type="submit"> Submit </button>
                            </div>
                        </div> :
                        <div className="text-empty-container" id="text-empty-container-id" style={this.state.translationElements !== undefined ? { display: 'none' } : { display: 'block' }}>
                            <h3>Add your own translation</h3>
                            <button type='button' onClick={this.handleIsFormActive}> ADD TRANSLATION </button>
                        </div>}
                </form>
                {this.state.translationElements !== undefined && 
                <div className="translation-text-preview" style={this.state.language === null ? { display: 'none' } : { display: 'block' }}>
                    <div className="translation-page-preview">
                        <p className='text-page-preview-user'>Posted by : <em>{this.state.loginUser !== '' && this.state.loginUser}</em></p>
                        <div className='translation-page-preview-text'>{this.state.translationElements === undefined ? '' : this.state.translationElements.translatedText}</div>
                    </div>
                </div>}
            </div>
        )
    }
}

export default withParams(AddTranslationForm)