import AxiosContextProvider from '@/contexts/axios.context';
import Head from 'next/head';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

type DefaultLayoutProps = { children: ReactNode };
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Head>
        <title>Zync</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <AxiosContextProvider>
          <main className="p-6">{children}</main>
          {process.env.NODE_ENV !== 'production' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </AxiosContextProvider>
      </QueryClientProvider>
    </>
  );
}
