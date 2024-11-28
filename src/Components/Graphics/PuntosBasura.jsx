import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import basura from '../../assets/iconos/basura.png'
import shadow from '../../assets/iconos/marker-shadow.png'

const PuntosBasura = ({ id, updateLayerCount }) => {
    const [PuntosBasura, setPuntosBasura] = useState(null)

    useEffect(() => {
        axios.get(`/maps/PuntosBasura.json`).then(res => {
            setPuntosBasura(res.data.data)
            updateLayerCount(id, res.data.data.length);
        }).catch(err => {
            console.error(err)
        })

        return () => {
            updateLayerCount(id, 0);
        }
    }, [])
    return (
        PuntosBasura?.map((punto, index) => {

            const icon = L.icon({
                iconUrl: basura,
                iconSize: [35, 35],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
                shadowUrl: shadow,
                shadowSize: [50, 50],
                shadowAnchor: [15, 40],
            });
            return (
                <Marker
                    key={index}
                    position={[punto.Latitud, punto.Longitud]}
                    icon={icon}
                >
                    <Popup>
                        <div className="text-left max-w-xs">
                            <h3 className="text-lg text-center font-semibold text-gray-800">Punto de basura: {punto.ID}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                <strong>Latitud:</strong> {punto.Latitud.toFixed(8)}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                <strong>Longitud:</strong> {punto.Longitud.toFixed(8)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )
        })
    )
}

export default PuntosBasura