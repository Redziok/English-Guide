import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_CALL } from '../components/constants';
import { IText, IUser } from '../components/DataTypes';

interface IUseUserTexts {
  user: IUser | null;
}

export const useUserTexts = ({ user }: IUseUserTexts) => {
  const [isLoading, setIsLoading] = useState(false);
  const [texts, setTexts] = useState<IText[]>([]);

  const fetchTexts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_CALL}/Text/user=${user?.id}`);
      if (res && res.data) {
        setTexts(res.data);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  return { isLoadingTexts: isLoading, texts };
};
