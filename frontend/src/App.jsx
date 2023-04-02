import { ItSocksProvider } from './itsocks/context/ItSocksProvider';
import { AppRouter } from './router/AppRouter';

export const App = () => {
  
  return (
    <ItSocksProvider>
      <AppRouter />
    </ItSocksProvider>
  )
}


