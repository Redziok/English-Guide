import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/TextPage.css';
import Select, { SingleValue } from 'react-select';
import { customStyles, API_CALL, languages, createToast } from '../../components/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { IUser, ILanguage, ITranslation } from '../../components/DataTypes';
import TranslationPopup from './TranslationPopup';
import { useText } from '../../hooks/useText';
import { LoadingComponent } from '../../components/LoadingComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';

interface ITextPageProps {
   user: IUser | null;
}

export interface ITranslationsDataParams {
   translations: ITranslation[];
   chosenTranslation: ITranslation | undefined;
}

const TextPage = ({ user }: ITextPageProps) => {
   const { textId } = useParams();
   const navigate = useNavigate();
   const { text, error, isTextLoading } = useText({ textId });
   const [translationsData, setTranslationsData] = useState<ITranslationsDataParams>({
      translations: [],
      chosenTranslation: undefined,
   });
   const [chosenLanguage, setChosenLanguage] = useState<ILanguage | null>(null);
   const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
   const [popupPosition, setPopupPosition] = useState<number>(0);
   const [sectionId, setSectionId] = useState<number>(0);

   const languagesArray = languages.filter(item => item.value !== text?.language);
   const textSplited = text?.text.split(/\r?\n\r?\n/);

   useEffect(() => {
      const fetchTranslations = async () => {
         await axios.get(`${API_CALL}/Translation/text=${textId}/language=${chosenLanguage?.value}`).then(res => {
            setTranslationsData(prev => ({
               translations: res.data,
               chosenTranslation: prev.chosenTranslation,
            }));
            addTranslations(res.data);
         });
      };
      fetchTranslations();
   }, [chosenLanguage?.value]);

   const addTranslations = (data: ITranslation[]) => {
      document.querySelectorAll('.has-translation').forEach(div => {
         if (div) div.className = 'text-containers empty';
      });
      data.map(translation => {
         const element = document.querySelector(`#text-container-section-${translation.sectionId}`);
         if (element) {
            editTextContainer('translated', translation.sectionId);
         }
      });
   };

   const removeText = () => {
      createToast
         .fire({
            showConfirmButton: true,
            customClass: {
               confirmButton: 'btn btn-success',
               cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
            text: 'Are you sure you want to delete the text?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            position: 'center',
            width: '400px',
            timer: 0,
         })
         .then((result: any) => {
            if (result.isConfirmed) {
               axios.delete(`${API_CALL}/Text/${textId}`).then(res => {
                  navigate('/');
               });
            } else if (result.isDismissed) return;
         });
   };

   const languageHandler = (language: SingleValue<ILanguage>) => setChosenLanguage(language);

   const editTextContainer = (action: string, section: number) => {
      const element = document.querySelector(`#text-container-section-${section}`);
      switch (action) {
         case 'empty':
            if (element) element.className = 'text-containers empty';
            break;
         case 'translating':
            if (element) element.classList.add('is-translating');
            break;
         case 'translated':
            if (element) element.className = 'text-containers has-translation';
      }
   };

   const handleTranslation = (event: any) => {
      const target = event.target;
      if (!target || !textSplited) return;

      const section = target.getAttribute('section-key');
      const translating = document.querySelector('.is-translating');
      if (translating) translating.classList.remove('is-translating');
      if (!target.classList.contains('text-containers')) {
         setIsPopupVisible(false);
         return;
      }
      if (!chosenLanguage?.value) {
         createToast.fire({
            icon: 'error',
            text: 'Language not chosen',
         });
         return;
      }
      setSectionId(Number(section));
      setIsPopupVisible(true);
      editTextContainer('translating', Number(section));
      section === (textSplited?.length - 1).toString() && Number(section) > 3 ? setPopupPosition(target.offsetTop - 300) : setPopupPosition(target.offsetTop - 100);
   };

   return (
      <div className='text-page-container'>
         <div className='text-page-preview' onClick={handleTranslation}>
            <div className='text-page-header'>
               <div className='text-page-header-info'>
                  <p className='text-page-preview-user'>
                     Posted by : <em>{text?.login}</em>
                  </p>
                  <div className='text-page-preview-title'>Title: {text?.title}</div>
                  <p className='text-page-preview-language'>{text?.language}</p>
                  {user && (user?.id === text?.idUser || user?.isAdmin) && (
                     <div className='text-page-button-container'>
                        <Button title='Remove translation' variant='outlined' color='error' onClick={removeText} startIcon={<FontAwesomeIcon icon={faTrash} color='red' />}>
                           Delete
                        </Button>
                     </div>
                  )}
               </div>
               <div>
                  <Select
                     styles={customStyles}
                     className='language-choose-container-add-translation'
                     value={chosenLanguage}
                     onChange={languageHandler}
                     options={languagesArray}
                     placeholder='Choose language'
                  />
               </div>
            </div>
            <hr />
            {isTextLoading ? (
               <LoadingComponent />
            ) : (
               <div className='text-page-preview-text'>
                  {textSplited &&
                     textSplited.map((section, idx) => (
                        <p id={`text-container-section-${idx}`} className='text-containers empty' key={idx} section-key={idx}>
                           {section}
                        </p>
                     ))}
               </div>
            )}
         </div>
         {isPopupVisible && (
            <TranslationPopup
               user={user}
               textOwnerId={text?.idUser}
               chosenLanguage={chosenLanguage}
               popupPosition={popupPosition}
               sectionId={sectionId}
               translationsData={translationsData}
               setTranslationsData={setTranslationsData}
            />
         )}
      </div>
   );
};

export default TextPage;
