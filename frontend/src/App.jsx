
import { Provider } from 'react-redux';

import { store } from './store/store';

import { ItSocksProvider } from './itsocks/context/ItSocksProvider';
import { AppRouter } from './router/AppRouter';


export const App = () => {

  return (
    <Provider store={store}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        type="text/css"
        charset="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      <ItSocksProvider>
        <AppRouter />
      </ItSocksProvider>
    </Provider>
  )
}


