import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import transporte from '../../assets/iconos/transporte.png'
import shadow from '../../assets/iconos/marker-shadow.png'

const Transporte = ({ id, updateLayerCount }) => {
    const [Transportes, setTransportes] = useState(null)

    useEffect(() => {
        axios.get(`/maps/Transporte.json`).then(res => {
            setTransportes(res.data.data)
            updateLayerCount(id, res.data.data.length);

        }).catch(err => {
            console.error(err)
        })

        return () => {
            updateLayerCount(id, 0);
        }
    }, [])


    return (
        Transportes?.map(punto => {
            const icon = L.icon({
                className: 'custom-icon',
                iconUrl: transporte,
                iconSize: [40, 40],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
                shadowUrl: shadow,
                shadowSize: [60, 50],
                shadowAnchor: [15, 40],
            });



            return (
                <Marker key={`${punto.id}`} position={[punto.Latitud, punto.Longitud]} icon={icon}
                >
                    <Popup>
                        <div className="text-left max-w-xs">
                            <h3 className="text-lg text-center font-semibold text-gray-800">Paradero</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                <strong>Ubicación:</strong> {punto.Puntos}
                            </p>
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

export default Transporte