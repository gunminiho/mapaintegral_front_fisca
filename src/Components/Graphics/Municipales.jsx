import axios from "axios";
import { useState, useEffect } from "react";
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import Camara from "../../assets/img/municipales.svg";


const CamarasMunicipales = ({ id, updateLayerCount }) => {
    const [camaras, setCamaras] = useState(null);

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;

    useEffect(() => {
        axios.get(`${endpoint}/camaras/municipales`)
            .then((res) => {
                setCamaras(res.data);
                updateLayerCount(id, res.data.length);
            })
            .catch((err) => {
                console.error(err);
            });

            return () => {
                updateLayerCount(id, 0);
            }
    }, []);

    return (
        <>
            {camaras && camaras.map((camara, key) => (

                <Marker
                    key={key} // Asegúrate de que 'id' es único para cada cámara
                    position={[camara.coordinates[1], camara.coordinates[0]]}
                    icon={L.icon({
                        iconUrl: Camara, // Cambia esta ruta al icono que desees usar
                        iconSize: [30, 30], // Ajusta el tamaño del icono
                        iconAnchor: [12, 41], // Anchor point of the icon. Defaults to iconSize / 2
                        popupAnchor: [1, -34], // Anchor point of the popup. Defaults to [0, -height]
                        //shadowUrl: '/ruta/a/sombra.png', // Cambia esta ruta si tienes una sombra
                        //shadowSize: [41, 41], // Ajusta el tamaño de la sombra
                    })}
                >
                    <Popup>
                        <span className="w-[fit-content]">
                            <p className="font-bold">{camara.name}</p>
                            <p>{camara.description}</p>
                            <p>Zona: {camara.zone}</p>
                            <p>Coordenadas: {`${camara.coordinates[1]} , ${camara.coordinates[0]}`}</p>
                        </span>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default CamarasMunicipales;
