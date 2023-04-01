import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_CALL, createToast } from '../../components/constants';
import { LoadingComponent } from '../../components/LoadingComponent';
import { useUserTranslations } from '../../hooks/useUserTranslations';
import { IProfileProps } from './Profile';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const TranslationsSubPage = (props: IProfileProps) => {
   const { isLoadingTranslations, translations } = useUserTranslations(props);

   const removeById = (id: number) => {
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
               axios.delete(`${API_CALL}/Translation/${id}`).then(res => {
                  useUserTranslations(props);
                  createToast.fire({
                     icon: 'success',
                     title: 'Deleted!',
                     text: `Your translation has been deleted`,
                  });
               });
            } else if (result.isDismissed) return;
         });
   };

   if (isLoadingTranslations) return <LoadingComponent />;

   return (
      <>
         {translations.map(translation => (
            <div key={translation.id} className='profile-text-container'>
               <Link to={`/Text/${translation.idText}`} className='profile-text'>
                  <div className='profile-text-preview-title-lang'>
                     {translation.title}
                     <p className='text-page-preview-language'>{translation.textLanguage}</p>
                  </div>
               </Link>
               <hr />
               <div className='text-page-preview-language translation'>{translation.language}</div>
               <div className='profile-text-preview-text'>{translation.translatedText}</div>
               <div className='profile-text-options'>
                  <Button variant='outlined' color='error' onClick={() => removeById(translation.id)} startIcon={<FontAwesomeIcon icon={faTrash} color='red' />}>
                     Delete
                  </Button>
               </div>
            </div>
         ))}
      </>
   );
};
