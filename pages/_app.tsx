import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';

export const queryClient: QueryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;