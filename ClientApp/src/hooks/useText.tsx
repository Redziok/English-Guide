import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_CALL } from '../components/constants';
import { IText } from '../components/DataTypes';

interface IUseText {
  textId: string | undefined;
}

export const useText = ({ textId }: IUseText) => {
  const [isTextLoading, setIsTextLoading] = useState(true);
  const [text, setText] = useState<IText | null>(null);
  const [error, setError] = useState<unknown>(null);

  const fetchText = async () => {
    try {
      const res = await axios.get(`${API_CALL}/Text/${textId}`);
      if (res && res.data) setText(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsTextLoading(false);
    }
  };

  useEffect(() => {
    fetchText();
  }, []);

  return { text, error, isTextLoading };
};
