import axios from 'axios';
import { API_CALL, createToast } from '../../components/constants';
import { useParams } from 'react-router-dom';
import { ILanguage, IRating, ITranslation, IUser } from '../../components/DataTypes';
import { ITranslationsDataParams } from './TextPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPaperPlane, faThumbsDown, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { TextareaAutosize } from '@mui/material';
import { FormEvent, SyntheticEvent, useEffect, useState } from 'react';

interface ITranslationPopupProps {
   user: IUser | null;
   textOwnerId: number | undefined;
   chosenLanguage: ILanguage | null;
   popupPosition: number;
   sectionId: number;
   translationsData: ITranslationsDataParams;
   setTranslationsData: (value: React.SetStateAction<ITranslationsDataParams>) => void;
}

interface ITranslationFormParams {
   text: string;
   isFormActive: boolean;
}

interface ITranslationRatingParams {
   rating: number;
   chosenTranslationRating: IRating | null;
}

const TranslationPopup = (props: ITranslationPopupProps) => {
   const { textId } = useParams<string>();
   const [translationForm, setTranslationForm] = useState<ITranslationFormParams>({
      text: '',
      isFormActive: false,
   });
   const [translationRating, settranslationRating] = useState<ITranslationRatingParams>({
      rating: 0,
      chosenTranslationRating: null,
   });
   const [userRatings, setUserRatings] = useState<IRating | null>();

   useEffect(() => {
      props.setTranslationsData({
         translations: props.translationsData.translations,
         chosenTranslation: props.translationsData.translations.find(e => e.sectionId.toString() === props.sectionId.toString()),
      });
      fetchRating();
      fetchUserRating();
      setTranslationForm({ text: '', isFormActive: false });
   }, [props.sectionId]);

   const handleTextSet = (event: FormEvent<HTMLInputElement>) => {
      setTranslationForm({ text: event.currentTarget.value, isFormActive: true });
   };

   const fetchRating = async () => {
      await axios.get(`${API_CALL}/Rating/text=${textId}/language=${props.chosenLanguage?.value}/section=${props.sectionId}`).then(res => {
         settranslationRating({
            chosenTranslationRating: res.data,
            rating: res.data.rating,
         });
      });
   };

   const fetchUserRating = async () => {
      await axios.get(`${API_CALL}/Rating/text=${textId}/language=${props.chosenLanguage?.value}/section=${props.sectionId}/user=${props.user?.id}`).then(res => {
         setUserRatings(res.data);
      });
   };

   const removeTranslation = (translation: ITranslation | undefined) => {
      if (!translation) return;
      createToast
         .fire({
            showConfirmButton: true,
            customClass: {
               confirmButton: 'btn btn-success',
               cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
            text: 'Are you sure you want to delete the translation?',
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
               axios.delete(`${API_CALL}/Translation/${translation.id}`).then(res => {
                  props.setTranslationsData((prev: ITranslationsDataParams) => ({
                     translations: prev.translations.filter((item: ITranslation) => item.id.toString() !== translation.id.toString()),
                     chosenTranslation: undefined,
                  }));
                  const element = document.querySelector(`#text-container-section-${translation.sectionId}`);
                  if (element) element.classList.replace('has-translation', 'empty');
                  createToast.fire({
                     icon: 'success',
                     title: 'Deleted!',
                     text: 'Your translation has been deleted',
                  });
               });
            } else if (result.isDismissed) return;
         });
   };

   const handleLike = (value: number) => {
      if (props.user == null) {
         createToast.fire({
            icon: 'error',
            text: 'Must be logged to rate',
         });
         return;
      }

      const body = {
         rating: value,
         idTranslation: props.translationsData.chosenTranslation?.id,
         idText: Number(textId),
         idUser: props.user?.id,
      };

      axios.post(`${API_CALL}/Rating`, body).then(res => {
         settranslationRating((prev: { chosenTranslationRating: any }) => ({
            chosenTranslationRating: prev.chosenTranslationRating,
            rating: !userRatings?.rating ? translationRating.rating + value : translationRating.rating + 2 * value,
         }));
         setUserRatings(res.data);
      });
   };

   const submitHandler = (e: SyntheticEvent) => {
      e.preventDefault();

      const body = {
         translatedText: translationForm.text,
         language: props.chosenLanguage?.value,
         idText: Number(textId),
         idUser: props.user?.id,
         sectionId: props.sectionId,
      };

      axios.post(`${API_CALL}/Translation`, body).then(res => {
         res.data.login = props.user?.login;
         props.setTranslationsData((prev: ITranslationsDataParams) => ({
            translations: [...prev.translations, res.data],
            chosenTranslation: res.data,
         }));
         const element = document.getElementById(`text-container-section-${res.data.sectionId}`);
         if (element) element.classList.replace('empty', 'has-translation');
         setTranslationForm({ text: '', isFormActive: false });
      });
   };

   return (
      <div>
         <div className='text-page-translation' style={{ top: `${props.popupPosition}px` }}>
            {props.translationsData?.chosenTranslation ? (
               <div className='translation-text-preview'>
                  <div className='translation-preview-header'>
                     <p className='text-page-preview-user'>
                        Posted by : <em>{props.translationsData.chosenTranslation?.login}</em>
                     </p>
                  </div>
                  <div className='translation-page-preview-text'>{props.translationsData?.chosenTranslation?.translatedText}</div>
                  <div className='translation-button-container'>
                     <div className='translation-rating-container' style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton aria-label='delete' title="I don't like this" disabled={userRatings?.rating === 1} onClick={() => handleLike(1)}>
                           <FontAwesomeIcon icon={faThumbsUp} color={userRatings?.rating === 1 ? '#ffa726' : 'white'} />
                        </IconButton>
                        <p style={{ margin: 0 }}>{translationRating?.rating > 0 ? `+${translationRating?.rating}` : translationRating?.rating}</p>
                        <IconButton aria-label='delete' title='I like this' disabled={userRatings?.rating === -1} onClick={() => handleLike(-1)}>
                           <FontAwesomeIcon icon={faThumbsDown} flip='horizontal' color={userRatings?.rating === -1 ? '#ffa726' : 'white'} />
                        </IconButton>
                     </div>
                     {props.user && (props.user?.id === props.textOwnerId || props.user?.id === props.translationsData?.chosenTranslation?.idUser || props.user?.isAdmin) && (
                        <Button
                           title='Remove translation'
                           variant='outlined'
                           color='error'
                           onClick={() => removeTranslation(props.translationsData?.chosenTranslation)}
                           startIcon={<FontAwesomeIcon icon={faTrash} color='red' />}>
                           Delete
                        </Button>
                     )}
                  </div>
               </div>
            ) : (
               <div className='text-empty-container' id='text-empty-container-id'>
                  {props.user != null ? (
                     <>
                        <h3>Add your own translation</h3>
                        {!translationForm?.isFormActive ? (
                           <>
                              <div className='translation-add-container'>
                                 <Button
                                    variant='contained'
                                    color='inherit'
                                    onClick={() => setTranslationForm({ isFormActive: true, text: '' })}
                                    startIcon={<FontAwesomeIcon icon={faAdd} />}>
                                    ADD TRANSLATION
                                 </Button>
                              </div>
                           </>
                        ) : (
                           <form onSubmit={submitHandler}>
                              <div className='text-container'>
                                 <TextareaAutosize
                                    placeholder='Translation'
                                    color='black'
                                    minRows={1}
                                    style={{ width: '100%', background: '#333', color: 'white' }}
                                    value={translationForm.text}
                                    onChange={e => setTranslationForm({ text: e.currentTarget.value, isFormActive: true })}
                                    required
                                 />
                              </div>
                              <div className='translation-add-container'>
                                 <Button
                                    variant='contained'
                                    type='submit'
                                    color='inherit'
                                    onClick={() => setTranslationForm({ isFormActive: true, text: '' })}
                                    endIcon={<FontAwesomeIcon icon={faPaperPlane} />}>
                                    SUBMIT
                                 </Button>
                              </div>
                           </form>
                        )}
                     </>
                  ) : (
                     <>
                        <h3>Must be logged to add translation</h3>
                        <div className='translation-add-container'>
                           <Button variant='contained' color='inherit' startIcon={<FontAwesomeIcon icon={faAdd} />} disabled>
                              ADD TRANSLATION
                           </Button>
                        </div>
                     </>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

export default TranslationPopup;
