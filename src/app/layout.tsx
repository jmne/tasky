import {Inter} from 'next/font/google';
import React from "react";

import '@/styles/globals.css';

import Header from '@/components/layout/Header';

import Provider from "@/utils/Provider";

export const metadata = {
    title: 'Tasky',
    description: 'Your personal task manager..',
};

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {


    return (
        <html lang='en' className={inter.className + " dark"}>
        <body>
        <Provider>
            {/* @ts-expect-error async server component */}
            <Header/>
            {children}
        </Provider>
        </body>
        </html>
    );
}
