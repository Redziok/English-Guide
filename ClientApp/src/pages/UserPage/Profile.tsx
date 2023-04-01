import { useState } from 'react';
import '../../styles/Profile.css';
import { useParams } from 'react-router-dom';
import { IUser } from '../../components/DataTypes';
import { TextsSubPage } from './TextsSubPage';
import { TranslationsSubPage } from './TranslationsSubPage';
import Button from '@mui/material/Button';

export interface IProfileProps {
   user: IUser | null;
}

const Profile = ({ user }: IProfileProps) => {
   const { userLogin } = useParams<string>();
   const [isTextChosen, setIsTextChosen] = useState<boolean>(true);

   if (!user || user?.login !== userLogin) return <h1 className='warning-text'>You're not authenticated</h1>;

   return (
      <div className='profile-container'>
         <div className='profile-main-button-container' style={{ color: '#333' }}>
            <Button type='submit' variant='contained' color='inherit' disabled={isTextChosen} onClick={() => setIsTextChosen(true)}>
               Texts
            </Button>
            <Button type='submit' variant='contained' color='inherit' disabled={!isTextChosen} onClick={() => setIsTextChosen(false)}>
               Translations
            </Button>
         </div>
         {isTextChosen ? <TextsSubPage user={user} /> : <TranslationsSubPage user={user} />}
      </div>
   );
};

export default Profile;
