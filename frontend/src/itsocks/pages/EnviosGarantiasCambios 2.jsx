import React, { useEffect } from 'react'

import styles from '../../ui/styles/EnviosGarantias.module.css';

export const EnviosGarantiasCambios = () => {

  useEffect(() => {
    // Scroll hacia arriba al cargar la página
    window.scrollTo(0, 0);
  }, []);
  return (

    <section className={ styles.main_section }>
      <h1>ENVÍOS, GARANTÍAS Y CAMBIOS</h1>
      
      <div className={ `${styles.envios} ${styles.container}` }>
        <h3>Envíos:</h3>
        <div className={ styles.text_content}>
          <p>El tiempo de envío es de <strong>3 a 4 días hábiles después del pago + 1 o 2 días</strong> que demora la transportadora en entregar. Recuerda que trabajamos sobre pedido (Tus It Socks entrarían en fila de producción), por eso manejamos estos tiempos.</p>
          <p> Recuerda que tu pedido estará llegando en el transcurso del día. En caso de que sea para dejar en portería, debes avisarnos para dejar una nota en tu pedido para autorizar la entrega.</p>
        </div>

      </div>

      <div className={ `${styles.envios} ${styles.container}` }>
        <h3>Garantías:</h3>
        <div className={ styles.text_content}>
          <p>Nos esforzamos por entregar un producto de la mejor calidad. En It Socks <strong>ofrecemos 30 días de garantía (a partir de la fecha de recibido el pedido)</strong> para devoluciones por defectos de fábrica, específicamente descosidos por confección, y por defectos del estampado y decoloración (no aplica decoloración por exceso de remojo). Debes enviarnos fotografía del producto indicando el imperfecto para ser evaluado por el equipo de ITSOCKS. (Los envíos para la devolución y reposición en este caso, los cubre ITSOCKS 100%)</p>

          <p><strong>No se aceptarán cambios por garantía en productos dañados y desgaste normal por el uso, o que hayan excedido la vida razonable del producto.</strong></p>
        </div>
      
      </div>

      <div className={ `${styles.envios} ${styles.container}` }>
        <h3>Cambio por otra talla, otro diseño o color:</h3>
        <div className={ styles.text_content}>
          <p>Si quieres un cambio por otra talla o por un diseño o referencia diferente lo puedes hacer. <strong>Debes notificarnos los primeros 10 días </strong>desde la recepción del pedido y tener en cuenta lo siguiente:</p>

          <ul>
            <li>Los dos costos de envío (a la empresa y retorno) los asume el comprador. Por esto es muy importante que revises bien la guía de tallas antes de realizar tu compra.</li>
            <li>El producto debe estar en perfectas condiciones (limpia y sin uso)</li>
            <li>Los cambios están sujetos a disponibilidad del producto.</li>
            <li>Las prendas en promoción no tienen cambio.</li>
            <li>Si es una referencia con un precio mayor, el cliente debe asumir la diferencia del valor.</li>
          </ul>
        </div>
      
      </div>
    </section>
  )
}
