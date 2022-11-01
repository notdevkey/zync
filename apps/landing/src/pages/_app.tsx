import { Navbar } from '@/components';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../styles/globals.css';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to landing!</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <main className="w-1/2">
          <Navbar />
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
