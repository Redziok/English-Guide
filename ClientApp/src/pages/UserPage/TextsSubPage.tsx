import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_CALL, createToast } from '../../components/constants';
import { LoadingComponent } from '../../components/LoadingComponent';
import { useUserTexts } from '../../hooks/useUserTexts';
import { IProfileProps } from './Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const TextsSubPage = (props: IProfileProps) => {
   const { isLoadingTexts, texts } = useUserTexts(props);

   const removeById = (id: number) => {
      createToast
         .fire({
            showConfirmButton: true,
            customClass: {
               confirmButton: 'btn btn-success',
               cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
            text: `Are you sure you want to delete the text?`,
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
               axios.delete(`${API_CALL}/Text/${id}`).then(res => {
                  createToast.fire({
                     icon: 'success',
                     title: 'Deleted!',
                     text: `Your text has been deleted`,
                  });
               });
            } else if (result.isDismissed) return;
         });
   };

   if (isLoadingTexts) return <LoadingComponent />;

   return (
      <>
         {texts.map(text => (
            <div key={text.id} className='profile-text-container'>
               <Link to={`/Text/${text.id}`} className='profile-text'>
                  <div className='profile-text-preview-title-lang'>
                     {text.title}
                     <p className='text-page-preview-language'>{text.language}</p>
                  </div>
               </Link>
               <hr />
               <div className='profile-text-preview-text'>{text.text}</div>
               <div className='profile-text-options'>
                  <Button variant='outlined' color='error' onClick={() => removeById(text.id)} startIcon={<FontAwesomeIcon icon={faTrash} color='red' />}>
                     Delete
                  </Button>
               </div>
            </div>
         ))}
      </>
   );
};
