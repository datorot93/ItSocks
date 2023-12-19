import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from "../../ui/styles/VideoComponent.module.css";

function VideoComponent() {
    const beneficiosImage = [
        {
            id: "b2",
            src: "../../../public/assets/homepage/beneficios/b2.mp4",
            description: "Video beneficios",
        },
    ];

    return (
        <Container>
            <Row>
                <Col sm={4}>
                    <div className={styles.beneficios_image_container}>
                        {beneficiosImage.map((image, index) => (
                            <video width={750} height={700} controls key={index}>
                                <source src={image.src} type="video/mp4" />
                            </video>
                        ))}
                    </div>
                </Col>
                <Col sm={8} className="justify-content-md-center">
                    <div className="justify-content-center">
                        <h2 className="d-flex justify-content-center" style={{ fontWeight: 800 }}>BENEFICIOS DE NUESTRAS</h2>
                        <h2 className="d-flex justify-content-center" style={{ fontWeight: 800 }}>MEDIAS DE COMPRESIÓN</h2>
                    </div>
                    <div className={styles.container_beneficios}>
                        <Row>
                            <Col sm={4}>
                                
                            </Col>
                            <Col sm={8}>
                                <h5>Mejora la circulación sanguínea</h5>
                                <p>Ayudan a aumentar el flujo de sangre desde las extremidades hacia el corazón</p>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.container_beneficios}>
                        <Row>
                            <Col sm={4}>
                                
                            </Col>
                            <Col sm={8}>
                                <h5>Mejora el rendimiento deportivo</h5>
                                <p>Algunos atletas utilizan medias de compresión para reducir la fatiga muscular durante el ejercicio.</p>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.container_beneficios}>
                        <Row>
                            <Col sm={4}>
                                
                            </Col>
                            <Col sm={8}>
                                <h5>Mejora la circulación sanguínea</h5>
                                <p>Tenemos una amplia variedad de diseños  para toda ocasión. </p>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default VideoComponent;