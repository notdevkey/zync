import Head from 'next/head';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';

type DefaultLayoutProps = { children: ReactNode };

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-6">{children}</main>

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
}
