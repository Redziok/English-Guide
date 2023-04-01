import axios from 'axios';
import { SyntheticEvent, useState } from 'react';
import '../../styles/LoginRegisterPage.css';
import { API_CALL, createToast } from '../../components/constants';
import { ILoginRegisterBody } from '../../hooks/useUser';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const RegisterForm = () => {
   const [registerForm, setIsRegisterForm] = useState<ILoginRegisterBody>({ login: '', email: '', password: '' });

   const onSubmitRegister = async (e: SyntheticEvent) => {
      e.preventDefault();

      try {
         const res = await axios.post(`${API_CALL}/User/register`, registerForm);
         if (res && res.data)
            createToast.fire({
               title: 'Successfully created account',
               timer: 2000,
            });
      } catch (err) {
         createToast.fire({
            title: 'Failed to create account',
            timer: 2000,
         });
      } finally {
      }
   };

   const updateLoginForm = (key: string) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
         setIsRegisterForm(prev => ({
            ...prev,
            [key]: e.target.value,
         }));
      };
   };

   return (
      <form onSubmit={onSubmitRegister}>
         <h2>Sign up</h2>
         <div className='input-field-wrapper'>
            <TextField id='filled-basic-login' label='Login' variant='outlined' onChange={updateLoginForm('login')} required />
         </div>
         <div className='input-field-wrapper'>
            <TextField id='filled-basic-email' label='Email' variant='outlined' onChange={updateLoginForm('email')} required />
         </div>
         <div className='input-field-wrapper'>
            <TextField id='filled-basic-password' label='Password' variant='outlined' type='password' onChange={updateLoginForm('password')} required />
         </div>
         <Button type='submit' variant='outlined'>
            Register
         </Button>
      </form>
   );
};

export default RegisterForm;
