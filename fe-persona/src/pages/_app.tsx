import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import RootLayout from '../app/layout';
// ...existing code...

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </SessionProvider>
    );
}

export default MyApp;
