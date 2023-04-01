import { SyntheticEvent, useState } from 'react';
import '../../styles/LoginRegisterPage.css';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from './RegisterPage';
import TextField from '@mui/material/TextField/TextField';
import { ILoginRegisterBody } from '../../hooks/useUser';
import { LoadingComponent } from '../../components/LoadingComponent';
import Button from '@mui/material/Button';

interface ILoginPage {
   loginUser: (body: ILoginRegisterBody) => Promise<boolean>;
   isUserLoading: boolean;
}

export const LoginRegisterPage = ({ loginUser, isUserLoading }: ILoginPage) => {
   const navigate = useNavigate();
   const [loginForm, setLoginForm] = useState<ILoginRegisterBody>({ login: '', password: '' });
   const [isRegisterForm, setIsRegisterForm] = useState(false);
   const [isPasswordWrong, setIsPasswordWrong] = useState(false);

   const updateLoginForm = (key: string) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
         setLoginForm(prev => ({
            ...prev,
            [key]: e.target.value,
         }));
         isPasswordWrong && setIsPasswordWrong(false);
      };
   };

   const onSubmitLogin = async (e: SyntheticEvent) => {
      e.preventDefault();
      const res = await loginUser(loginForm);
      res ? navigate('/') : setIsPasswordWrong(true);
   };

   if (isUserLoading)
      return (
         <div className='signup-form-container'>
            <div className='signup-form'>
               <LoadingComponent />
            </div>
         </div>
      );

   return (
      <div className='signup-form-container'>
         <div className='signup-form'>
            {isRegisterForm ? (
               <RegisterForm />
            ) : (
               <form onSubmit={onSubmitLogin}>
                  <h2>Sign in</h2>
                  <div className='input-field-wrapper'>
                     <TextField id='filled-basic-login' label='Login' variant='outlined' onChange={updateLoginForm('login')} error={isPasswordWrong} required />
                  </div>
                  <div className='input-field-wrapper'>
                     <TextField
                        id='filled-basic-password'
                        label='Password'
                        variant='outlined'
                        type='password'
                        onChange={updateLoginForm('password')}
                        helperText={isPasswordWrong && 'Incorrect credentials'}
                        error={isPasswordWrong}
                        required
                     />
                  </div>
                  <Button type='submit' variant='outlined'>
                     Login
                  </Button>
               </form>
            )}
            <p className='signup-toggle-element' onClick={() => setIsRegisterForm(!isRegisterForm)}>
               {!isRegisterForm ? 'Register a new account' : 'I already have an account'}
            </p>
         </div>
      </div>
   );
};

export default LoginRegisterPage;
