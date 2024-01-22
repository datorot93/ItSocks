import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "../../ui/components/Navbar";
import { ItSocks, Medias, Packs, Productos } from "../pages";
import { Personalizadas } from "../pages/Personalizadas";
import { MigaDePan } from "../../ui/components/MigaDePan";
import { Suscription } from "../../ui/components/Suscription";
import { Footer } from "../../ui/components/Footer";
import { Mas } from "../pages/Mas";
import { PreguntasFrecuentes } from "../pages/PreguntasFrecuentes";
import { PersonalizadaPantorrillera } from "../pages/PersonalizadaPantorrillera";
import { ProductDescription } from "../components/ProductDescription";
import { CartProvider } from "../../context/cart";
import { CarritoCompras } from "../pages/CarritoCompras";
import { ShippingProvider } from "../../context/shipping";
import { Billing } from "../pages/Billing";
import { Estilos } from "../pages/Estilos";
import { FinishOrder } from "../pages/FinishOrder";
import { BillingInfo } from "../pages/BillingInfo";
import { PacksProducts } from "../pages/PacksProducts";
import { PackProductDescription } from "../components/packs/PackProductDescription";
import { PackProvider } from "../../context/pack";
import { GuiaTallas } from "../pages/GuiaTallas";
import { EnviosGarantiasCambios } from "../pages/EnviosGarantiasCambios";
import { PoliticaProteccionDatos } from "../pages/PoliticaProteccionDatos";

export const ItSocksRoutes = () => {
  const { pathname } = useLocation();

  // console.log(pathname);
  return (
    <>
      <CartProvider>
        <PackProvider>
          <ShippingProvider>
            <Navbar />
            <MigaDePan />

            <Routes>
              <Route
                path="accesorios"
                element={<Productos categoria={"Accesorios"} isPack={ false }/>}
              />
              <Route
                path="accesorios/viseras"
                element={
                  <Productos
                    categoria={"Accesorios"}
                    subcategoria={"Viseras"}
                  />
                }
              />
              <Route
                path="accesorios/termos"
                element={
                  <Productos categoria={"Accesorios"} subcategoria={"TERMOS"} />
                }
              />
              <Route
                path="accesorios/pines"
                element={
                  <Productos categoria={"Accesorios"} subcategoria={"PINES"} />
                }
              />
              <Route
                path="accesorios/canguros"
                element={
                  <Productos categoria={"Accesorios"} subcategoria={"CANGUROS"} />
                }
              />
              <Route
                path="accesorios/termos/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="accesorios/viseras/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="accesorios/pines/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="accesorios/canguros/:nombre"
                element={<ProductDescription />}
              />

              {/* PACKS */}

              <Route path="packs" element={<Packs />} />
              {/* PACKS LARGAS */}
              <Route
                path="packs/largas"
                element={<PacksProducts categoria={"Medias"} type={"Largas"} />}
              />

              <Route
                path="packs/largas/:disenio"
                element={<PacksProducts categoria={"Medias"} type={"Largas"} />}
              />

              <Route
                path="packs/largas/:disenio/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/largas/:nombre"
                element={<PackProductDescription />}
              />

              {/* PACKS PANTORRILLERAS */}
              <Route
                path="packs/pantorrilleras"
                element={<PacksProducts categoria={"Medias"} type={"Pantorrilleras"} />}
              />

              <Route
                path="packs/pantorrilleras/:disenio"
                element={<PacksProducts categoria={"Medias"} type={"Pantorrilleras"} />}
              />

              <Route
                path="packs/pantorrilleras/:disenio/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/pantorrilleras/:nombre"
                element={<PackProductDescription />}
              />

              {/* PACKS MEDIA CAÑA */}
              <Route
                path="packs/media_cania"
                element={<PacksProducts categoria={"Medias"} type={"Media caña"} />}
              />

              <Route
                path="packs/media_cania/:disenio"
                element={<PacksProducts categoria={"Medias"} type={"Media caña"} />}
              />

              <Route
                path="packs/media_cania/:disenio/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/media_cania/:nombre"
                element={<PackProductDescription />}
              />

              {/* PACKS MEDIA CAÑA */}

              {/* <Route
                path="packs/largas/animales"
                element={
                  <PacksProducts
                    categoria={"Medias"}
                    type={"Largas"}
                    disenio={"ANIMALES"}
                  />
                }
              />

              <Route
                path="packs/largas/animales/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/largas/comida"
                element={
                  <PacksProducts
                    categoria={"Medias"}
                    type={"Largas"}
                    disenio={"COMIDA"}
                  />
                }
              />
              <Route
                path="packs/largas/comida/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/largas/naturaleza"
                element={
                  <PacksProducts
                    categoria={"Medias"}
                    type={"Largas"}
                    disenio={"NATURALEZA"}
                  />
                }
              />
              <Route
                path="packs/largas/naturaleza/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/largas/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/pantorrilleras"
                element={
                  <PacksProducts categoria={"Medias"} type={"Pantorrilleras"} />
                }
              />
              <Route
                path="packs/pantorrilleras/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/media_cania"
                element={
                  <PacksProducts categoria={"Medias"} type={"Media caña"} />
                }
              />
              <Route
                path="packs/media_cania/:nombre"
                element={<PackProductDescription />}
              /> */}

              {/* MAS */}
              <Route path="mas" element={<Mas />} />
              <Route
                path="mas/preguntas_frecuentes"
                element={<PreguntasFrecuentes />}
              />
              <Route
                path="mas/envios_garantias_cambios"
                element={<EnviosGarantiasCambios />}
              />
              <Route path="politicas_proteccion_datos" element={ <PoliticaProteccionDatos />} />

              <Route
                path="medias"
                element={<Medias subcategory={"Medias"} />}
              />

              <Route
                path="medias/personalizadas"
                element={<Personalizadas subcategory={"personalizadas"} />}
              />
              <Route
                path="medias/personalizadas/pantorrilleras"
                element={
                  <PersonalizadaPantorrillera subcategory={"Pantorrilleras"} />
                }
              />
              <Route
                path="medias/personalizadas/largas"
                element={
                  <PersonalizadaPantorrillera subcategory={"Largas"} />
                }
              />
              <Route
                path="medias/personalizadas/media_cania"
                element={
                  <PersonalizadaPantorrillera subcategory={"Media_Cania"} />
                }
              />

              <Route
                path="medias/estampadas"
                element={<Personalizadas subcategory={"Estampadas"} />}
              />
              <Route
                path="medias/tejidas"
                element={<Personalizadas subcategory={"Tejidas"} />}
              />

              {/* ESTAMPADAS PANTORRILLERAS */}
              <Route
                path="medias/estampadas/pantorrillera"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Pantorrilleras"}
                  />
                }
              />
              <Route 
                path="medias/estampadas/pantorrillera/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Largas"}
                  />
                }
              />
              <Route
                path="medias/estampadas/pantorrillera/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/estampadas/pantorrillera/:nombre"
                element={<ProductDescription />}
              />

              {/* ESTAMPADAS LARGAS  */}
              <Route
                path="medias/estampadas/larga"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Largas"}
                  />
                }
              />
              <Route 
                path="medias/estampadas/larga/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Largas"}
                  />
                }
              />
              <Route
                path="medias/estampadas/larga/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/estampadas/larga/:nombre"
                element={<ProductDescription />}
              />

              {/* ESTAMPADAS MEDIA CANIA  */}
              <Route
                path="medias/estampadas/media_cania"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Media caña"}
                  />
                }
              />
              <Route 
                path="medias/estampadas/media_cania/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Estampadas"}
                    type={"Largas"}
                  />
                }
              />
              <Route
                path="medias/estampadas/media_cania/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/estampadas/media_cania/:nombre"
                element={<ProductDescription />}
              />

              {/* TEJIDAS PANTORRILLERAS */}
              <Route
                path="medias/tejidas/pantorrillera"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Pantorrilleras"}
                  />
                }
              />
              <Route 
                path="medias/tejidas/pantorrillera/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Pantorrilleras"}
                  />
                }
              />
              <Route
                path="medias/tejidas/pantorrillera/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/tejidas/pantorrillera/:nombre"
                element={<ProductDescription />}
              />

              {/* TEJIDAS LARGAS  */}
              <Route
                path="medias/tejidas/larga"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Largas"}
                  />
                }
              />
              <Route 
                path="medias/tejidas/larga/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Largas"}
                  />
                }
              />
              <Route 
                path="medias/tejidas/larga/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/tejidas/larga/:nombre"
                element={<ProductDescription />}
              />

              {/* TEJIDAS MEDIA CANIA  */}
              <Route
                path="medias/tejidas/media_cania"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Media caña"}
                  />
                }
              />
              <Route
                path="medias/tejidas/media_cania/:disenio"
                element={
                  <Productos
                    categoria={"Medias"}
                    subcategoria={"Tejidas"}
                    type={"Media caña"}
                  />
                }
              />
              <Route
                path="medias/tejidas/media_cania/:disenio/:nombre"
                element={<ProductDescription />}
              />
              <Route
                path="medias/tejidas/media_cania/:nombre"
                element={<ProductDescription />}
              />

              {/* PERSONALIZADAS */}
              <Route
                path="medias/personalizadas/pantorrillera"
                element={
                  <PersonalizadaPantorrillera subcategory={"Pantorrilleras"} />
                }
              />

              {/* GUÍA DE TALLAS */}
              <Route path="mas/guia_tallas" element={<GuiaTallas />} />


              <Route path="running" element={<Estilos estilo={"running"} />} />
              <Route path="running/tipo_media/:filter" element={<Estilos estilo={"running"} filtro={"tipo"}/>} />              
              <Route path="running/estilo_media/:filter" element={<Estilos estilo={"running"} filtro={"estilo"}/>} />
              <Route path="running/tipo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="running/estilo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="running/:disenio/:producto" element={<ProductDescription />} />


              <Route path="trabajo" element={<Estilos estilo={"trabajo"} />} />
              <Route path="trabajo/tipo_media/:filter" element={<Estilos estilo={"trabajo"} filtro={"tipo"}/>} />
              <Route path="trabajo/estilo_media/:filter" element={<Estilos estilo={"trabajo"} filtro={"estilo"}/>} />
              <Route path="trabajo/estilo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="trabajo/tipo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="trabajo/:disenio/:producto" element={<ProductDescription/>} />

              
              <Route path="dia_a_dia" element={<Estilos estilo={"día a día"} />} />
              <Route path="dia_a_dia/tipo_media/:filter" element={<Estilos estilo={"día a día"} filtro={"tipo"}/>} />
              <Route path="dia_a_dia/estilo_media/:filter" element={<Estilos estilo={"día a día"} filtro={"estilo"}/>} />
              <Route path="dia_a_dia/estilo_media/:filter/:producto" element={<ProductDescription/>}/>
              <Route path="dia_a_dia/tipo_media/:filter/:producto" element={<ProductDescription/>}/>
              <Route path="dia_a_dia/:disenio/:producto" element={<ProductDescription/>}/>


              <Route path="fitness" element={<Estilos estilo={"fitness"} />} />
              <Route path="fitness/tipo_media/:filter" element={<Estilos estilo={"fitness"} filtro={"tipo"}/>} />
              <Route path="fitness/estilo_media/:filter" element={<Estilos estilo={"fitness"} filtro={"estilo"}/>} />
              <Route path="fitness/estilo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="fitness/tipo_media/:filter/:producto" element={<ProductDescription/>} />
              <Route path="fitness/:disenio/:producto" element={<ProductDescription/>} />


              <Route path="ciclismo" element={<Estilos estilo={"ciclismo"} />} />
              <Route path="ciclismo/tipo_media/:filter" element={<Estilos estilo={"ciclismo"} filtro={"tipo"}/>} />
              <Route path="ciclismo/estilo_media/:filter" element={<Estilos estilo={"ciclismo"} filtro={"estilo"}/>} />
              <Route path="ciclismo/estilo_media/:filter/:producto" element={<ProductDescription/>}/>
              <Route path="ciclismo/tipo_media/:filter/:producto" element={<ProductDescription/>}/>
              <Route path="ciclismo/:disenio/:producto" element={<ProductDescription/>}/>


              {/* COMPRAS */}
              <Route path="carrito" element={<CarritoCompras />} />
              <Route path="carrito/billing" element={<Billing />} />
              <Route
                path="carrito/billing/finish_order"
                element={<FinishOrder />}
              />
              <Route
                path="carrito/billing/billing_info"
                element={<BillingInfo />}
              />

              <Route path="/" element={<ItSocks />} />
            </Routes>
            <Suscription />
            <Footer />
          </ShippingProvider>
        </PackProvider>
      </CartProvider>
    </>
  );
};
