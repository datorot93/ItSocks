import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components/Navbar';
import { Accesorios, ItSocks, Medias, Packs } from '../pages';


export const ItSocksRoutes = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="accesorios" element={ <Accesorios /> } />
        <Route path="medias" element={ <Medias /> } />
        <Route path="packs" element={ <Packs /> } />
        
        <Route path="/" element={ <ItSocks /> } />
      </Routes>
    </>
    
  )
}
