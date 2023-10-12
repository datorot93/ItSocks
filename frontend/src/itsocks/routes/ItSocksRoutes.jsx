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
                element={<Productos categoria={"accesorios"} />}
              />
              <Route
                path="accesorios/viceras"
                element={
                  <Productos
                    categoria={"accesorios"}
                    subcategoria={"viceras"}
                  />
                }
              />
              <Route
                path="accesorios/termos"
                element={
                  <Productos categoria={"accesorios"} subcategoria={"termos"} />
                }
              />
              <Route
                path="accesorios/pines"
                element={
                  <Productos categoria={"accesorios"} subcategoria={"pines"} />
                }
              />
              <Route
                path="accesorios/:nombre"
                element={<ProductDescription />}
              />

              {/* PACKS */}

              <Route path="packs" element={<Packs />} />
              <Route
                path="packs/largas"
                element={<PacksProducts categoria={"medias"} type={"largas"} />}
              />

              <Route
                path="packs/largas/animales"
                element={
                  <PacksProducts
                    categoria={"medias"}
                    type={"largas"}
                    disenio={"animales"}
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
                    categoria={"medias"}
                    type={"largas"}
                    disenio={"comida"}
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
                    categoria={"medias"}
                    type={"largas"}
                    disenio={"naturaleza"}
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
                  <PacksProducts categoria={"medias"} type={"pantorrillera"} />
                }
              />
              <Route
                path="packs/pantorrilleras/:nombre"
                element={<PackProductDescription />}
              />

              <Route
                path="packs/media_cania"
                element={
                  <PacksProducts categoria={"medias"} type={"media caña"} />
                }
              />
              <Route
                path="packs/media_cania/:nombre"
                element={<PackProductDescription />}
              />

              <Route path="mas" element={<Mas />} />
              <Route
                path="mas/preguntas_frecuentes"
                element={<PreguntasFrecuentes />}
              />

              <Route
                path="medias"
                element={<Medias subcategory={"medias"} />}
              />

              <Route
                path="medias/personalizadas"
                element={
                  <Personalizadas subcategory={"medias personalizadas"} />
                }
              />
              <Route
                path="medias/personalizadas/pantorrilleras"
                element={
                  <PersonalizadaPantorrillera
                    subcategory={"medias pantorrilleras"}
                  />
                }
              />

              <Route
                path="medias/estampadas"
                element={<Personalizadas subcategory={"medias estampadas"} />}
              />
              <Route
                path="medias/tejidas"
                element={<Personalizadas subcategory={"medias tejidas"} />}
              />

              {/* ESTAMPADAS PANTORRILLERAS */}
              <Route
                path="medias/estampadas/pantorrillera"
                element={
                  <Productos
                    categoria={"medias"}
                    subcategoria={"estampadas"}
                    type={"pantorrillera"}
                  />
                }
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
                    categoria={"medias"}
                    subcategoria={"estampadas"}
                    type={"largas"}
                  />
                }
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
                    categoria={"medias"}
                    subcategoria={"estampadas"}
                    type={"media caña"}
                  />
                }
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
                    categoria={"medias"}
                    subcategoria={"tejidas"}
                    type={"pantorrillera"}
                  />
                }
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
                    categoria={"medias"}
                    subcategoria={"tejidas"}
                    type={"largas"}
                  />
                }
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
                    categoria={"medias"}
                    subcategoria={"tejidas"}
                    type={"media caña"}
                  />
                }
              />
              <Route
                path="medias/tejidas/media_cania/:nombre"
                element={<ProductDescription />}
              />

              <Route
                path="medias/personalizadas/pantorrillera"
                element={
                  <PersonalizadaPantorrillera
                    subcategory={"medias pantorrilleras"}
                  />
                }
              />

              <Route path="running" element={<Estilos estilo={"running"} />} />
              <Route
                path="ciclismo"
                element={<Estilos estilo={"ciclismo"} />}
              />
              <Route path="trabajo" element={<Estilos estilo={"trabajo"} />} />
              <Route path="casual" element={<Estilos estilo={"casual"} />} />
              <Route path="fitness" element={<Estilos estilo={"fitness"} />} />

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
