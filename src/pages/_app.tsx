import '@/styles/globals.css'
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app'
import store from '@/core/redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Provider>

    </ThemeProvider>
  )
}

