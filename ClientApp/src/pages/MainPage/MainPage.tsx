import '../../styles/MainPage.css';
import { useNavigate } from 'react-router-dom';
import TextElements from './TextElements';
import { LoadingComponent } from '../../components/LoadingComponent';
import { memo } from 'react';
import { IText, IUser } from '../../components/DataTypes';
import TextField from '@mui/material/TextField';

interface IMainPage {
   user: IUser | null;
   texts: IText[];
   isTextsLoading: boolean;
   filteredTexts: IText[];
}

const MainPage = ({ user, texts, isTextsLoading, filteredTexts }: IMainPage) => {
   const navigate = useNavigate();

   if (isTextsLoading) return <LoadingComponent />;

   return (
      <div className='search-text-container'>
         {user != null && (
            <div className='add-text-input-container'>
               <TextField
                  id='standard-input-add-text'
                  defaultValue='Add your own text'
                  InputProps={{
                     readOnly: true,
                  }}
                  hiddenLabel
                  sx={{ input: { cursor: 'pointer' } }}
                  fullWidth
                  variant='filled'
                  onClick={() => navigate('/AddText')}
               />
            </div>
         )}
         {texts?.length < 1 ? (
            <h1>There are no texts, {user == null && 'login and'} add your own </h1>
         ) : (
            <div className='search-text-header'>
               {filteredTexts.length < 1 ? texts?.map(text => <TextElements text={text} key={text?.id} />) : filteredTexts?.map(text => <TextElements text={text} key={text?.id} />)}
            </div>
         )}
      </div>
   );
};

export default memo(MainPage);
