import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '../../ui/components/Navbar';
import { ItSocks, Medias, Packs, Productos } from '../pages';
import { Estampadas } from '../pages/Estampadas';
import { Tejidas } from '../pages/Tejidas';
import { Personalizadas } from '../pages/Personalizadas';
import { MigaDePan } from '../../ui/components/MigaDePan';
import { Suscription } from '../../ui/components/Suscription';
import { Footer } from '../../ui/components/Footer';
import { Mas } from '../pages/Mas';
import { PreguntasFrecuentes } from '../pages/PreguntasFrecuentes';
import { PersonalizadaPantorrillera } from '../pages/PersonalizadaPantorrillera';
import { ProductDescription } from '../components/ProductDescription';
import { EstampadaPantorrillera } from '../components/EstampadaPantorrillera';


export const ItSocksRoutes = () => {

  const {pathname} = useLocation()

  // console.log(pathname);
  return (
    <>
      <Navbar />
      <MigaDePan />
      
      <Routes>
        <Route path="accesorios" element={ <Productos categoria={ "accesorios" }/> } />
        <Route path="accesorios/viceras" element={ <Productos categoria={ "accesorios"} subcategoria={ "viceras" }/>} />
        <Route path="accesorios/termos" element={ <Productos categoria={ "accesorios"} subcategoria={ "termos" }/>} />
        <Route path="accesorios/pines" element={ <Productos categoria={ "accesorios"} subcategoria={ "pines" }/>} />
        <Route path="accesorios/:nombre" element={ <ProductDescription /> } />
        <Route path="packs" element={ <Productos categoria={ "packs" } subcategoria={ "packs" }/> } />

        <Route path="mas" element={ <Mas /> } />
        <Route path="mas/preguntas_frecuentes" element={ <PreguntasFrecuentes /> } />

        <Route path="medias" element={ <Medias subcategory={"medias"}/> } />
        
        <Route path="medias/personalizadas" element={ <Personalizadas subcategory={"medias personalizadas"}/> } />
        <Route path="medias/personalizadas/pantorrilleras" element={ <PersonalizadaPantorrillera subcategory={"medias pantorrilleras"}/> } />
        

        <Route path="medias/estampadas" element={ <Personalizadas subcategory={"medias estampadas"}/> } />        
        <Route path="medias/estampadas/pantorrillera" element={ <Productos categoria={ "medias" } subcategoria={"estampadas"}/> } />
        <Route path="medias/estampadas/pantorrillera/:nombre" element={ <ProductDescription /> } />

        <Route path="medias/personalizadas/pantorrillera" element={ <PersonalizadaPantorrillera subcategory={"medias pantorrilleras"}/> } />
        

        <Route path="/" element={ <ItSocks /> } />
      </Routes>
      <Suscription />
      <Footer />
    </>
    
  )
}
