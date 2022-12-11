import axios, { Axios } from 'axios';
import { createContext, PropsWithChildren, useMemo } from 'react';

export const AxiosContext = createContext<Axios>(new Axios());

export default function AxiosContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const client = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:3333/api',
      // process.env.NODE_ENV === 'production'
      //   ? process.env.NEXT_PUBLIC_HOST_PROD
      //   : process.env.NEXT_PUBLIC_HOST_DEV,
    });
  }, []);
  return (
    <AxiosContext.Provider value={client}>{children}</AxiosContext.Provider>
  );
}
