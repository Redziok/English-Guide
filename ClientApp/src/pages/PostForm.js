import axios from "axios";
import React, { Component } from "react";
import '../styles/AddText.css';
import Select from 'react-select';
import { customStyles, API_CALL } from "../components/constants";

export const languages = [
    { value: 'Polish', label: 'Polish' },
    { value: 'English', label: 'English' },
    { value: 'German', label: 'German' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Spanish', label: 'Spanish' },
  ];

export class PostForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            text: '',
            language: null,
            idUser: null
        }
    }

    componentDidMount() {
        (
            async () => {
              const response = await fetch(`${API_CALL}/User/user`, {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
              });
       
              const content = await response.json();
              this.setState({idUser: content.idUser});
            }
           )();
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    languageHandler = (language) => {
        this.setState({ language });
      };

    submitHandler = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('text', this.state.text);
        formData.append('idUser', this.state.idUser);
        formData.append('textLanguage', this.state.language['value']);
        axios.post(`${API_CALL}/Text`, formData )
            .then(res => {
                this.setState({
                    title: '',
                    text: '',
                    language: '' 
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const { title, text, language } = this.state
        return (
            <div className='add-text-container'>
                <form id="login-form" onSubmit={this.submitHandler}>
                    <div className="add-text-inputs">
                    <h3 className="title-text">Title</h3>
                    <div className='title-container'>
                        <input type='text' className='title' name='title' value={title} onChange = {this.changeHandler}/>   
                    </div>
                    <h3 className="text-text">Text</h3>
                    <div className="text-container">
                        <textarea type='text' className='text' name='text' value={text} onChange = {this.changeHandler}/>  
                    </div>
                    </div>
                        <div className="options-container">
                        <label className="language-choose-label">Choose Text language</label>
                        <div className="language-choose-container">
                            <Select
                                styles={customStyles}
                                className="language-choose-container-add-text"
                                value = {language}
                                onChange = {this.languageHandler}
                                options = {languages}
                                defaultValue = {languages[0]}
                        />
                            <button className="submit" type="submit"> Submit </button>
                        </div> 
                    </div>
                </form>
            </div>
        )
    }
}

export default PostForm