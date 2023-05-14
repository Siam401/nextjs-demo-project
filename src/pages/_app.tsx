import '@/styles/globals.css'
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app'
import store from '@/core/redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
        <Component {...pageProps} />
      </Provider>

    </ThemeProvider>
  )
}

