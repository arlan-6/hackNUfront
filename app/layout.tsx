import '@mantine/core/styles.css';

import React from 'react';
import Script from 'next/script';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Header } from '@/components/Header/Header';
import { theme } from '../theme';
import { WidgetContainer } from './widget/components/widget-container';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Header />
          {children}
        <WidgetContainer clientKey={'key'}/>
        </MantineProvider>
        {/* <Script
          src={'http://127.0.0.1:3334/widget.js'}
          data-client-key={'http://127.0.0.1:3334/widget.js'}
          data-style-url="http://127.0.0.1:3334/widget.css"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  );
}
