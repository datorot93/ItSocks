import React, { useEffect, useState } from "react";

// DATA
import { countries } from "../data/lista_paises";
// import { departamentos } from "../data/lista_departamentos";
// ESTILOS
import styles from "../../ui/styles/FormShippingEstimates.module.css";
import { useCart } from "../../hooks/useCart";
// ÍCONOS
import camion from "../../../public/assets/carrito/Truck.svg";
import regalo from "../../../public/assets/carrito/regalo 1.svg";
import { Link } from "react-router-dom";
import { useShipping } from "../../hooks/useShipping";
import { getCiudadesPorDepartamento, getDepartamentos, getShippingCost } from "../helpers/getShippingInfo";

export const FormShippingEstimates = () => {
  // Estados
  const { cart } = useCart();
  const { addShipping } = useShipping();

  const [departamentos, setDepartamentos] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("Colombia");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [datosExtra, setDatosExtra] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [indicacionesExtra, setIndicacionesExtra] = useState("");
  const [isAcepted, setIsAcepted] = useState(false);

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      return acumulador + objeto.price;
    }
  }, 0);

  useEffect(() => {
    if(selectedCountry === "Colombia") {
      getDepartamentos().then(
        (res) => setDepartamentos(res.departamentos)
      ).catch(
        (err) => console.log(err)
      )
    }
  }, [selectedCountry])

  useEffect(() => {
    if(selectedCountry === "Colombia") {
      getCiudadesPorDepartamento( selectedRegion ).then(
        (res) => setCities(res.municipio_ciudad)
      ).catch(
        (err) => console.log(err)
      )
    }
  }, [selectedRegion])

  useEffect(() => {
    if(selectedCountry === "Colombia" && selectedRegion && selectedCity) {
      if (total < 250000) {
        getShippingCost( selectedRegion, selectedCity ).then(
          (res) => setShippingCost(Number(res.tarifa))
        ).catch(
          (err) => console.log(err)
        )
      }else{
        setShippingCost(0)
      }
    }
  }, [selectedRegion, selectedCity])

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleRegionChange = (event) => {
    const selectedRegionValue = event.target.value; // Almacenamos el valor seleccionado en una variable temporal
    setSelectedRegion(selectedRegionValue); // Actualizamos el estado con el valor seleccionado
  };


  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleDireccion = (event) => {
    setDireccion(event.target.value);
  };

  const handleDatosExtra = (event) => {
    setDatosExtra(event.target.value);
  };

  const handleCheckedChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleFrom = (event) => {
    setFrom(event.target.value);
  };

  const handleTo = (event) => {
    setTo(event.target.value);
  };

  const handleIndicacionesExtra = (event) => {
    setIndicacionesExtra(event.target.value);
  };

  const handleAceptedChange = (event) => {
    setIsAcepted(event.target.checked);
  };

  const handleCalculateShipping = (event) => {
    setIsCalculated(true);
  };

  const subtotal = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (Object.keys(objeto).length == 12) {
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      return acumulador + objeto.price;
    }
  }, 0);

  return (
    <div className={styles.main_container}>
      <h3 className={ styles.title }>DATOS DE ENVÍO</h3>
      <div className={styles.form_shipping}>
        <div className={styles.form_field}>
          <p>País/Región</p>
          <select value={selectedCountry} onChange={handleCountryChange}>
            {countries.map((country) => (
              <option value={country} key={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {selectedCountry === "Colombia" ? (
          <>
            <div className={styles.form_field}>
              <p>Departamento</p>
              <select value={selectedRegion} onChange={handleRegionChange}>
                <option value="">Seleccione una departamento</option>
                {departamentos.map((departamento) => (
                  <option value={departamento} key={departamento}>
                    {departamento}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_field}>
              <p>Ciudad</p>
              <select value={selectedCity} onChange={handleCityChange}>
                <option value="">Seleccione una ciudad</option>
                {cities.map((ciudad) => (
                  <option value={ciudad} key={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_field}>
              <p>Dirección de envío</p>
              <input
                type="text"
                value={direccion}
                placeholder="Escriba su dirección"
                onChange={handleDireccion}
              />
              <input
                type="text"
                value={datosExtra}
                placeholder="Apartamento, local, etc (opcional)"
                onChange={handleDatosExtra}
              />
            </div>

            <div className={styles.form_field_regalo}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckedChange}
              />
              ¡Es un regalo!
              <img src={regalo} alt="Ícono de regalo" />
            </div>
            {isChecked ? (
              <>
                <div className={styles.form_field}>
                  <p>De quien</p>
                  <input
                    type="text"
                    value={from}
                    onChange={handleFrom}
                  />
                </div>
                <div className={styles.form_field}>
                  <p>Para quien</p>
                  <input
                    type="text"
                    value={to}
                    onChange={handleTo}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.form_field}>
              <p>
                <strong>Instrucciones especiales para el vendedor</strong>
              </p>
              <textarea
                value={indicacionesExtra}
                onChange={handleIndicacionesExtra}
              />
            </div>

            <div className={styles.subtotal}>
              <div>
                <span>SUBTOTAL</span>
              </div>
              <div>
                <span>
                  {total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </span>
              </div>
            </div>

            <div className={styles.costo_envio}>
              {total > 250000 ? (
                <>
                  <img src={camion} alt="Ícono de regalo" />
                  <p>
                    Tienes <strong>ENVÍO GRATIS</strong>
                  </p>
                </>
              ) : (
                <p>Envío: { shippingCost.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                }) }</p>
              )}
            </div>

            <div className={styles.mensaje_envio}>
              <p>Gastos de envío y descuentos calculado al momento de pagar</p>
            </div>

            <div className={styles.form_field_tyc}>
              <input
                type="checkbox"
                checked={isAcepted}
                onChange={handleAceptedChange}
              />
              Acepto los términos y condiciones
              {/* Acá poner ícono trolo de regalo */}
            </div>

            <div className={styles.finalizar_pedido}>
              {
                isAcepted && selectedCountry && selectedCity && selectedRegion && direccion ?
                <Link to="billing">
                  <button
                    className={`${styles.finalizar_pedido_button} ${
                      isAcepted ? "" : styles.disabled_button
                    }`}
                    onClick={() =>
                      addShipping({
                        country: selectedCountry,
                        region: selectedRegion,
                        city: selectedCity,
                        address: direccion,
                        billingAddress: direccion,
                        from: from,
                        to: to,
                        extra_information: datosExtra,
                        shipping_value: shippingCost,
                        isGift: isChecked,
                      })
                    }
                  >
                    FINALIZAR COMPRA
                  </button>
                </Link>
                :<></>
              }
            </div>
          </>
        ) : (
          <div className={styles.envios_exterior}>
            <p>
            No tenemos convenios para enviar a otros países desde la página web, pero te tenemos una solución. Dale click al siguiente botón:
            </p>
            <p className={ styles.hola }>At the moment, we don’t support international purchases made via our website. However, we offer other payment methods which might work better for you. If you want to learn more, click here:</p>
            <a
              href={`https://api.whatsapp.com/send?phone=573143939837&text=Hola!%20Cordial%20saludo,%20estoy%20interesad@%20en%20comprar%20productos%20IT%20SOCKS`}
              target="_blank"
            >
              <button className={styles.finalizar_pedido_button}>
                CONTÁCTANOS
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
