import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components/Navbar';
import { Accesorios, ItSocks, Medias, Packs } from '../pages';
import { Estampadas } from '../pages/Estampadas';
import { Tejidas } from '../pages/Tejidas';
import { Personalizadas } from '../pages/Personalizadas';
import { MigaDePan } from '../../ui/components/MigaDePan';
import { Suscription } from '../../ui/components/Suscription';
import { Footer } from '../../ui/components/Footer';


export const ItSocksRoutes = () => {
  return (
    <>
      <Navbar />
      <MigaDePan />
      
      <Routes>
        <Route path="accesorios" element={ <Accesorios /> } />
        <Route path="medias" element={ <Medias subcategory={"medias"}/> } />
        <Route path="packs" element={ <Packs /> } />

        <Route path="medias/estampadas" element={ <Estampadas subcategory={"medias estampadas"}/> } />
        <Route path="medias/tejidas" element={ <Tejidas subcategory={"medias tejidas"}/> } />
        <Route path="medias/personalizadas" element={ <Personalizadas subcategory={"medias personalizadas"}/> } />


        <Route path="/" element={ <ItSocks /> } />
      </Routes>
      <Suscription />
      <Footer />
    </>
    
  )
}
