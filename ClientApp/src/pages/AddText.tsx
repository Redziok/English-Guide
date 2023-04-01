import React, { FormEvent, SyntheticEvent, useState } from 'react';
import '../styles/AddText.css';
import { useNavigate } from 'react-router-dom';
import { customStyles, API_CALL, createToast, languages } from '../components/constants';
import axios from 'axios';
import Select from 'react-select';
import { ILanguage, IUser } from '../components/DataTypes';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface IAddTextProps {
   user: IUser | null;
}

interface ITextPost {
   title: string;
   text: string;
   idUser: number;
   language: string;
}

const AddText = (props: IAddTextProps) => {
   const navigate = useNavigate();
   const [title, setTitle] = useState('');
   const [text, setText] = useState('');
   const [language, setLanguage] = useState<ILanguage | null>();

   const postText = async () => {
      if (!props.user?.id || !language?.value) return;

      const body: ITextPost = {
         title: title,
         text: text,
         idUser: props.user?.id,
         language: language?.value,
      };

      const res = await axios.post(`${API_CALL}/Text`, body);
      if (res && res.data) navigate(`/Text/${res.data.id}`);
   };

   const submitHandler = (e: SyntheticEvent) => {
      e.preventDefault();
      if (!language?.value) {
         createToast.fire({
            icon: 'error',
            text: 'Language not chosen',
         });
         return;
      }
      let textAreas = text.split(/\r?\n\r?\n/);
      if (textAreas.length !== 1) postText();
      else {
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
            .then(result => {
               if (result.isConfirmed) postText();
               else if (result.isDismissed) return;
            });
      }
   };

   return (
      <div className='add-text-container'>
         <form id='add-text-form' onSubmit={submitHandler}>
            <div className='add-text-inputs'>
               <div className='title-container'>
                  <TextField id='filled-basic-Title' label='Title' variant='outlined' value={title} onChange={e => setTitle(e.currentTarget.value)} fullWidth required />
               </div>
               <div className='text-container'>
                  <TextField id='outlined-multiline-text' label='Text' value={text} onChange={e => setText(e.currentTarget.value)} multiline fullWidth maxRows={2} required />
               </div>
               <p className='text-alert'>Leave a space between paragraph to split the text into sections and make it easier to translate! </p>
               <Select
                  styles={customStyles}
                  className='language-choose-container-add-text'
                  value={language}
                  onChange={language => setLanguage(language)}
                  options={languages}
                  placeholder='Select text language'
               />
               <hr />
               <div className='button-container'>
                  <Button variant='contained' type='submit' color='inherit' endIcon={<FontAwesomeIcon icon={faPaperPlane} />}>
                     SUBMIT
                  </Button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default AddText;
