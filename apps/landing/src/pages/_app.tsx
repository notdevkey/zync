import { Navbar } from '@/components';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const codeDisplay = `{ "name": "test" }`;

  return (
    <>
      <Head>
        <title>Welcome to landing!</title>
      </Head>
      <main className="w-1/2">
        <Navbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
