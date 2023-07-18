
import { Provider } from 'react-redux';

import { store } from './store/store';

import { ItSocksProvider } from './itsocks/context/ItSocksProvider';
import { AppRouter } from './router/AppRouter';


export const App = () => {
  
  return (
    <Provider store={ store }>
      <ItSocksProvider>
        <AppRouter />
      </ItSocksProvider>
    </Provider>
  )
}


