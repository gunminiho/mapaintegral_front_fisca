import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { LayerGroup, Marker, Popup } from 'react-leaflet';
import delictivas from "../../assets/iconos/user_secret.svg"
import perturbaciones from "../../assets/iconos/user_secret.svg"
import transito from "../../assets/iconos/user_secret.svg"
import question from "../../assets/iconos/question.svg"

const resources = {
    transito: [
        "Choque",
        "Tráfico",
        "Atropello"
    ],
    delictivas: [
        "Robo",
        "Vandalismo",
        "Asesinato"
    ],
    perturbaciones: [
        "Fiesta callejera y/o colocación de toldo para cierre de calles",
        "Consumo de bebidas alcohólicas en espacios públicos",
        "Desorden por comercio ambulatorio en el espacio público"
    ]
};

const iconMapping = {
    transito,
    delictivas,
    perturbaciones,
    question
};

function TransporteIncidencias() {
    const [transportes, setTransportes] = useState(null);

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;

    useEffect(() => {
        axios.get(`${endpoint}/incidencias`)
            .then((res) => {
                setTransportes(res.data.incidencias);

            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    function FindTipo(value) {
        for (const key in resources) {
            if (resources[key].includes(value)) {
                return iconMapping[key];
            }
        }
        return iconMapping["question"];
    }


    return (
        <>
            {transportes && transportes.map((incidencia, key) => {

                const iconSrc = FindTipo(incidencia.tipo);
                const icon = L.divIcon({
                    className: 'custom-marker',
                    html: `
                                <div style="
                                    width: 30px;
                                    height: 30px;
                                    position: relative;
                                ">
                                    <img src="${iconSrc}" alt="icon" style="width: 100%; height: 100%;" />
                                </div>
                            `,
                    iconSize: 30,
                    iconAnchor: [30 / 2, 30],
                    popupAnchor: [0, -30]
                });

                return (
                    <Marker
                        key={key} // Asegúrate de que 'id' es único para cada cámara
                        position={[incidencia.latitude, incidencia.longitude]}
                        icon={icon}
                    >
                        <Popup>
                            <span className="w-[fit-content]">
                                <p>Tipo: {incidencia.tipo}</p>
                                <p>Teléfono: {incidencia.phoneNumber}</p>
                                <p>Descripcion: {incidencia.especificacion}</p>
                                {incidencia.imageUrl && <img src={incidencia.imageUrl} alt="imagen referencia" />}
                            </span>
                        </Popup>
                    </Marker>
                )
            })}
        </>
    )
}

export default TransporteIncidencias