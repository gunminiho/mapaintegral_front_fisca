import axios from "axios";
import { useState, useEffect } from "react";
import { Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import Camara from "../../assets/img/vecinales.png";

const CamarasVecinales = ({ id, updateLayerCount }) => {
    const [camaras, setCamaras] = useState(null);

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;

    useEffect(() => {
        axios.get(`${endpoint}/camaras/vecinales`)
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
            {camaras && camaras.map((camara, index) => {
                return (
                    camara.LATITUD && camara.LONGITUD ?
                        <Marker
                            key={index} 
                            position={[camara.LATITUD, camara.LONGITUD]}
                            icon={L.icon({
                                iconUrl: Camara,
                                iconSize: [40, 30],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                            })}
                        >
                            <Popup>
                                <span className="w-[fit-content]">
                                    <p>Vecino: {camara.nombre_vecino}</p>
                                    <p>Coordenadas: {`${camara.LATITUD} , ${camara.LONGITUD}`}</p>
                                </span>
                            </Popup>
                        </Marker>
                        :
                        <></>
                )

            })}
        </>
    );
};

export default CamarasVecinales;
