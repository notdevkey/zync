import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to landing!</title>
      </Head>
      <main className="flex justify-center">
        <div className="w-1/2">
          <Component {...pageProps} />
        </div>
      </main>
    </>
  );
}

export default CustomApp;
