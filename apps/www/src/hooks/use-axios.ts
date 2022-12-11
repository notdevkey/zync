import { AxiosContext } from '@/contexts/axios.context';
import { useContext } from 'react';

export function useAxios() {
  return useContext(AxiosContext);
}
