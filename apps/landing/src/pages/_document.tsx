import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />

        <link
          rel="preload"
          href="/fonts/ClashDisplay-Medium.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
