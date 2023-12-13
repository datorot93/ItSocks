import React, { useState } from "react";

// DATA
import { countries } from "../data/lista_paises";
import { departamentos } from "../data/lista_departamentos";
// ESTILOS
import styles from "../../ui/styles/FormShippingEstimates.module.css";
import { useCart } from "../../hooks/useCart";
// ÍCONOS
import camion from "../../../public/assets/carrito/Truck.svg";
import regalo from "../../../public/assets/carrito/regalo 1.svg";
import { Link } from "react-router-dom";
import { useShipping } from "../../hooks/useShipping";

export const FormShippingEstimates = () => {
  const { cart } = useCart();
  const { addShipping } = useShipping();

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
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleRegionChange = (event) => {
    const selectedRegionValue = event.target.value; // Almacenamos el valor seleccionado en una variable temporal
    setSelectedRegion(selectedRegionValue); // Actualizamos el estado con el valor seleccionado

    // Actualizamos las ciudades según la región seleccionada
    if (departamentos[selectedRegionValue]) {
      setCities(departamentos[selectedRegionValue]);
    } else {
      setCities([]);
    }
  };

  const total = cart.reduce((acumulador, objeto) => {
    // Agregar una condición para filtrar elementos
    if (!objeto.name.toLowerCase().includes("pack")) {
      console.log("Entré");
      return acumulador + objeto.cantidad * objeto.price;
    } else {
      console.log("No entré");
      return acumulador + objeto.price; // No se suma al acumulador si no cumple la condición
    }
  }, 0);

  console.log(total);

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

  const handleFinishOrder = () => {
    addShipping({
      country: selectedCountry,
      region: selectedRegion,
      city: selectedCity,
      address: direccion,
      from: from,
      to: to,
      extra_information: datosExtra,
      shipping_value: 0,
    });
    console.log("Orden finalizada");
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
      <h3>GET SHIPPING ESTIMATES</h3>
      <div className={styles.form_shipping}>
        <div className={styles.form_field}>
          <p>País/Region</p>
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
              <p>Provincia</p>
              <select value={selectedRegion} onChange={handleRegionChange}>
                <option value="">Seleccione una provincia</option>
                {Object.keys(departamentos).map((departamento) => (
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
              <p>Direcicón</p>
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
                  <p>De quién</p>
                  <input
                    type="text"
                    value={from}
                    placeholder="Apartamento, local, etc (opcional)"
                    onChange={handleFrom}
                  />
                </div>
                <div className={styles.form_field}>
                  <p>Para quién</p>
                  <input
                    type="text"
                    value={to}
                    placeholder="Apartamento, local, etc (opcional)"
                    onChange={handleTo}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            <div className={styles.form_field}>
              <p>
                <strong>INSTRUCCIONES ESPECIALES PARA EL VENDEDOR</strong>
              </p>
              <textarea
                value={indicacionesExtra}
                onChange={handleIndicacionesExtra}
              />
            </div>

            <div className={styles.calculate_shipping}>
              <button
                className={styles.calculate_shipping_button}
                onClick={handleCalculateShipping}
              >
                CALCULATE SHIPPING
              </button>
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
                <p>Envío: $ 5.000</p>
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
                      from: from,
                      to: to,
                      extra_information: datosExtra,
                      shipping_value: 0,
                    })
                  }
                >
                  FINALIZAR PEDIDO
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.envios_exterior}>
            <p>
              No tenemos convenios para enviar a otros paises desde la pagina
              web pero te tenemos una solocion dale clic al boton.
            </p>
            <button className={styles.finalizar_pedido_button}>
              CONTÁCTANOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
