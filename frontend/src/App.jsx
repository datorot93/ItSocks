
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
        crossorigin="anonymous"
      />
      <ItSocksProvider>
        <AppRouter />
      </ItSocksProvider>
    </Provider>
  )
}


