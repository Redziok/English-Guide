import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import '../styles/TextPage.css'; 
import AddTranslationForm from "./AddTranslationForm";
import { API_CALL } from "../components/constants";

function TextPage() {
  const [texts, setTexts] = useState([])
  const [user, setUser] = useState([])
  const params = useParams();

    useEffect(() => {
        axios.get(`${API_CALL}/Text/${params.textId}`)
            .then(res => {
                setTexts(res.data)
            })
            .catch(err => {
                console.log(err)
            })

        axios.get(`${API_CALL}/User/${texts.idUser}`)
        .then(res => {
            setUser(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    },[texts.idUser, params.textId])

  return (
      <div className="text-page-container">
        <div className="text-page-preview">
          <p className='text-page-preview-user'>Posted by : <em>{user.login}</em></p>
          <div className='text-page-preview-title'>Title: {texts.title}</div>
          <p className='text-page-preview-language'>{texts.textLanguage}</p>
          <hr></hr>
          <div className='text-page-preview-text'>{texts.text}</div>  
        </div>
          <AddTranslationForm/>
      </div>
  );
}

export default TextPage; 