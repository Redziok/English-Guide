import React, {useState, useEffect} from 'react'
import '../styles/SearchText.css'; 
import axios from 'axios';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { API_CALL } from "../components/constants";

function SearchText() {
  const [texts, setTexts] = useState([])
  const navigate = useNavigate();

    useEffect( () => {
       axios.get(`${API_CALL}/Text`)
            .then(res => {
              setTexts(res.data)
              console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })    
    },[]);

    const onTextClick = () => {
      navigate('/AddText');
    }

    return (
    <div className="search-text-container">
      <div className='add-text-input-container'>
        <input className="add-text" type='text' placeholder='Add your own text' onClick={onTextClick}></input>
      </div>
      <div className="search-text-header">
          {texts.map(text => (
            <Link to={`/Text/${text.idText}`} key={text.idText}>
              {<div className='text-list-element' key={text.idText}>{text.title}
                <p></p><p className='text-list-language'>{text.textLanguage}</p>
              </div>}
            </Link>
          ))}
      </div>
      <Outlet />
    </div>
  );
}


export default SearchText;