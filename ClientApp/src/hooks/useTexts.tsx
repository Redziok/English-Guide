import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_CALL } from '../components/constants';
import { IText } from '../components/DataTypes';

export const useTexts = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [texts, setTexts] = useState<IText[]>([]);
   const [error, setError] = useState<unknown>(null);

   const fetchTexts = async () => {
      setIsLoading(true);
      try {
         const res = await axios.get(`${API_CALL}/Text`);
         if (res && res.data) setTexts(res.data);
      } catch (err) {
         setError(err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchTexts();
   }, []);

   return { texts, error, isTextsLoading: isLoading };
};
