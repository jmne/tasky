'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/client';
import React, {useState} from 'react';
import superjson from 'superjson';

import {trpc} from '@/utils/trpc';

/**
 * Function to determine the base URL for API requests.
 *
 * @returns {string} The base URL.
 */
function getBaseUrl() {
    if (typeof window !== 'undefined')
        // browser should use a relative path
        return '';

    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Provider component to set up TRPC and React Query clients.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The provider component.
 */
export default function Provider({children}: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api`,
                }),
            ],
            transformer: superjson,
        })
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
}
