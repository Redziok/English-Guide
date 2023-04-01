import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_CALL } from '../components/constants';
import { IUser } from '../components/DataTypes';

export interface ILoginRegisterBody {
   login: string;
   password: string;
   email?: string;
}

export const useUser = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [user, setUser] = useState<IUser | null>(null);
   const [error, setError] = useState<unknown>('');

   const fetchUser = async () => {
      setIsLoading(true);
      try {
         const res = await axios.get(`${API_CALL}/User/user`, { withCredentials: true });
         if (res && res.data) setUser(res.data);
      } catch (err) {
         setUser(null);
         setError(err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchUser();
   }, []);

   const loginUser = async (body: ILoginRegisterBody) => {
      let isSuccess: boolean = false;
      try {
         const res = await axios.post(`${API_CALL}/User/login`, body, { withCredentials: true });
         if (res.status == 200) {
            await fetchUser();
            isSuccess = true;
         }
      } catch (err) {
         isSuccess = false;
      } finally {
         return isSuccess;
      }
   };

   const logoutUser = async () => {
      try {
         await axios.post(`${API_CALL}/User/logout`, null, { withCredentials: true });
      } catch (err) {
      } finally {
         fetchUser();
      }
   };

   return { user, error, isUserLoading: isLoading, loginUser, logoutUser };
};
