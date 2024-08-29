import React, { useEffect, useMemo, useState } from "react";

import { Route, Routes } from "react-router-dom";
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
import { WishProvider } from "../../context/wish";
import { WishList } from "../pages/WishList";
import { Search } from "../pages/Search";
import { WishListShared } from "../pages/WishListShared";
import { DiscountProvider } from "../../context/discount";
import { PreferenceProvider } from "../../context/preference";
import { getFiltersAccesorios } from "../helpers/getProductsByCategory";
import { OrderDescription } from "../pages/OrderDescription";

export const ItSocksRoutes = () => {

  const [ filtrosAccesorios, setFiltrosAccesorios ] = useState([]);

  useEffect(() => {
    getFiltersAccesorios( "accesorios" ).then(
      (res) => setFiltrosAccesorios(Object.keys(res))
    ).catch(
      (err) => console.log(err)
    )
  }, [])
  

  return (
    <>
      <CartProvider>
        <WishProvider>
          <PackProvider>
            <ShippingProvider>
              <DiscountProvider>

              <Navbar />
              <MigaDePan />
              <Routes>
                {/* SEARCH */}
                <Route
                  path="search"
                  element={<Search />}
                />

                <Route
                  path="search/:product"
                  element={<ProductDescription />}
                />

                {
                  filtrosAccesorios.map( (filtro, index) => (
                    <React.Fragment key={ index }>
                      <Route
                        path="accesorios"
                        element={<Productos categoria={"Accesorios"} isPack={ false }/>}
                      />
                      <Route
                        path={`accesorios/${filtro.replace('%20', '_').toLowerCase()}`}
                        element={
                          <Productos
                            categoria={"Accesorios"}
                            subcategoria={`${filtro}`}
                          />
                        }
                      />
                      {/* <Route
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
                      /> */}
                      
                    </React.Fragment>
                  ))

                }
                {
                  filtrosAccesorios.map( (filtro, index) => (
                    <Route
                      path={`accesorios/${filtro.replace(' ', '_')}/:nombre`}
                      element={<ProductDescription />}
                      key={ index }
                    />
                  ))
                }
                {/* <Route
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
                /> */}

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
                  path="packs/largas/:disenio/:compresion"
                  element={<PacksProducts categoria={"Medias"} type={"Largas"} />}
                />

                <Route
                  path="packs/largas/:disenio/:compresion/:nombre"
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
                  path="packs/pantorrilleras/:disenio/:compresion"
                  element={<PacksProducts categoria={"Medias"} type={"Pantorrilleras"} />}
                />

                <Route
                  path="packs/pantorrilleras/:disenio/:compresion/:nombre"
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
                  path="packs/media_cania/:disenio/:compresion"
                  element={<PacksProducts categoria={"Medias"} type={"Media caña"} />}
                />

                <Route
                  path="packs/media_cania/:compresion/:disenio/:nombre"
                  element={<PackProductDescription />}
                />

                <Route
                  path="packs/media_cania/:nombre"
                  element={<PackProductDescription />}
                />

        

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
                  element={<Personalizadas subcategory={"Personalizadas"} />}
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
                  path="medias/personalizadas/tobilleras"
                  element={
                    <PersonalizadaPantorrillera subcategory={"Tobilleras"} />
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
                  path="medias/estampadas/pantorrilleras"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/estampadas/pantorrilleras/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/estampadas/pantorrilleras/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route
                  path="medias/estampadas/pantorrilleras/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/pantorrilleras/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/pantorrilleras/:nombre"
                  element={<ProductDescription />}
                />

                {/* ESTAMPADAS LARGAS  */}
                <Route
                  path="medias/estampadas/largas"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Largas"}
                    />
                  }
                />              
                <Route 
                  path="medias/estampadas/largas/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Largas"}
                    />
                  }
                />
                <Route 
                  path="medias/estampadas/largas/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Largas"}
                    />
                  }
                />
                <Route
                  path="medias/estampadas/largas/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/largas/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/largas/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />

                {/* ESTAMPADAS TOBILLERAS  */}
                <Route
                  path="medias/estampadas/tobilleras"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Tobilleras"}
                    />
                  }
                />              
                <Route 
                  path="medias/estampadas/tobilleras/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Tobilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/estampadas/tobilleras/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Tobilleras"}
                    />
                  }
                />
                <Route
                  path="medias/estampadas/tobilleras/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/tobilleras/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/tobilleras/:disenio/:compresion/:nombre"
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
                      type={"Media caña"}
                    />
                  }
                />
                <Route 
                  path="medias/estampadas/media_cania/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Estampadas"}
                      type={"Media caña"}
                    />
                  }
                />
                <Route
                  path="medias/estampadas/media_cania/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/media_cania/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/estampadas/media_cania/:nombre"
                  element={<ProductDescription />}
                />

                {/* TEJIDAS PANTORRILLERAS */}
                <Route
                  path="medias/tejidas/pantorrilleras"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/pantorrilleras/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/pantorrilleras/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Pantorrilleras"}
                    />
                  }
                />
                <Route
                  path="medias/tejidas/pantorrilleras/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/tejidas/pantorrilleras/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/tejidas/pantorrilleras/:nombre"
                  element={<ProductDescription />}
                />

                {/* TEJIDAS LARGAS  */}
                <Route
                  path="medias/tejidas/largas"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Largas"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/largas/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Largas"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/largas/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Largas"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/largas/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route 
                  path="medias/tejidas/largas/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/tejidas/largas/:nombre"
                  element={<ProductDescription />}
                />

                {/* TEJIDAS TOBILELRAS  */}
                <Route
                  path="medias/tejidas/tobilleras"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Tobilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/tobilleras/:disenio"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Tobilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/tobilleras/:disenio/:compresion"
                  element={
                    <Productos
                      categoria={"Medias"}
                      subcategoria={"Tejidas"}
                      type={"Tobilleras"}
                    />
                  }
                />
                <Route 
                  path="medias/tejidas/tobilleras/:disenio/:nombre"
                  element={<ProductDescription />}
                />
                <Route 
                  path="medias/tejidas/tobilleras/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                <Route
                  path="medias/tejidas/tobilleras/:nombre"
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
                  path="medias/tejidas/media_cania/:disenio/:compresion"
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
                  path="medias/tejidas/media_cania/:disenio/:compresion/:nombre"
                  element={<ProductDescription />}
                />
                
                <Route
                  path="medias/tejidas/media_cania/:nombre"
                  element={<ProductDescription />}
                />

                {/* PERSONALIZADAS */}
                <Route
                  path="medias/personalizadas/pantorrilleras"
                  element={
                    <PersonalizadaPantorrillera subcategory={"Pantorrilleras"} />
                  }
                />

                {/* GUÍA DE TALLAS */}
                <Route path="mas/guia_tallas" element={<GuiaTallas />} />

                {/* ESTILOS */}
                <Route path="running" element={<Estilos estilo={"running"} />} />
                <Route path="running/tipo_media/:filter" element={<Estilos estilo={"running"} filtro={"tipo"}/>} />              
                <Route path="running/estilo_media/:filter" element={<Estilos estilo={"running"} filtro={"estilo"}/>} />
                <Route path="running/tipo_media/:filter/:compresion" element={<Estilos estilo={"running"} filtro={"tipo"}/>} />
                <Route path="running/estilo_media/:filter/:compresion" element={<Estilos estilo={"running"} filtro={"estilo"}/>} />
                <Route path="running/estilo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />
                <Route path="running/tipo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />


                <Route path="trabajo" element={<Estilos estilo={"trabajo"} />} />
                <Route path="trabajo/tipo_media/:filter" element={<Estilos estilo={"trabajo"} filtro={"tipo"}/>} />
                <Route path="trabajo/estilo_media/:filter" element={<Estilos estilo={"trabajo"} filtro={"estilo"}/>} />
                <Route path="trabajo/tipo_media/:filter/:compresion" element={<Estilos estilo={"trabajo"} filtro={"tipo"}/>} />
                <Route path="trabajo/estilo_media/:filter/:compresion" element={<Estilos estilo={"trabajo"} filtro={"estilo"}/>} />
                <Route path="trabajo/estilo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />
                <Route path="trabajo/tipo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />

                
                <Route path="dia_a_dia" element={<Estilos estilo={"día a día"} />} />
                <Route path="dia_a_dia/tipo_media/:filter" element={<Estilos estilo={"día a día"} filtro={"tipo"}/>} />
                <Route path="dia_a_dia/estilo_media/:filter" element={<Estilos estilo={"día a día"} filtro={"estilo"}/>} />
                <Route path="dia_a_dia/tipo_media/:filter/:compresion" element={<Estilos estilo={"día a día"} filtro={"tipo"}/>} />
                <Route path="dia_a_dia/estilo_media/:filter/:compresion" element={<Estilos estilo={"fitndía a díass"} filtro={"estilo"}/>} />
                <Route path="dia_a_dia/estilo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />
                <Route path="dia_a_dia/tipo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />


                <Route path="fitness" element={<Estilos estilo={"fitness"} />} />
                <Route path="fitness/tipo_media/:filter" element={<Estilos estilo={"fitness"} filtro={"tipo"}/>} />
                <Route path="fitness/estilo_media/:filter" element={<Estilos estilo={"fitness"} filtro={"estilo"}/>} />
                <Route path="fitness/tipo_media/:filter/:compresion" element={<Estilos estilo={"fitness"} filtro={"tipo"}/>} />
                <Route path="fitness/estilo_media/:filter/:compresion" element={<Estilos estilo={"fitness"} filtro={"estilo"}/>} />
                <Route path="fitness/estilo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />
                <Route path="fitness/tipo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />


                <Route path="ciclismo" element={<Estilos estilo={"ciclismo"} />} />
                <Route path="ciclismo/tipo_media/:filter" element={<Estilos estilo={"ciclismo"} filtro={"tipo"}/>} />
                <Route path="ciclismo/estilo_media/:filter" element={<Estilos estilo={"ciclismo"} filtro={"estilo"}/>} />
                <Route path="ciclismo/tipo_media/:filter/:compresion" element={<Estilos estilo={"ciclismo"} filtro={"tipo"}/>} />
                <Route path="ciclismo/estilo_media/:filter/:compresion" element={<Estilos estilo={"ciclismo"} filtro={"estilo"}/>} />
                <Route path="ciclismo/estilo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />
                <Route path="ciclismo/tipo_media/:filter/:compresion/:producto" element={<ProductDescription/>} />

                
                {/* WISH LIST */}
                <Route 
                  path="lista_de_favoritos" 
                  element={<WishList />} 
                />

                <Route 
                  path="lista_de_favoritos/:id_lista" 
                  element={<WishListShared/>} 
                />
                

                <Route path="/" element={<ItSocks />} />
              </Routes>

              <PreferenceProvider>
                <Routes>
                  
                  {/* CARRITO COMPRA */}
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
                </Routes>
                
                {/* DESCRIPCIÓN ORDEN */}
                <Routes>
                  <Route 
                    path="order/:id_order" 
                    element={<OrderDescription />} 
                  />
                </Routes>
                </PreferenceProvider>
              <Suscription />
              <Footer />
              </DiscountProvider>
            </ShippingProvider>
          </PackProvider>
        </WishProvider>
      </CartProvider>
    </>
  );
};
