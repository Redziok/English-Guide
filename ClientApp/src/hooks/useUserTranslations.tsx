import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_CALL } from '../components/constants';
import { ITranslation, IUser } from '../components/DataTypes';

interface IUseUserTranslations {
  user: IUser | null;
}

export const useUserTranslations = ({ user }: IUseUserTranslations) => {
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<ITranslation[]>([]);

  const fetchTranslations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_CALL}/Translation/user=${user?.id}`);
      if (res && res.data) {
        setTranslations(res.data);
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  return { isLoadingTranslations: isLoading, translations };
};
